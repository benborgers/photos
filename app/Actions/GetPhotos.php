<?php

namespace App\Actions;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Spatie\Image\Enums\Fit;
use Spatie\Image\Image;
use Symfony\Component\Yaml\Yaml;

class GetPhotos
{
    public static function call()
    {
        return collect([
            ...self::legacyPhotos(),
            ...self::icloudPhotos(),
        ])->sortBy('date')->values();
    }

    public static function legacyPhotos()
    {
        $photos = [];

        foreach (scandir(resource_path('legacy-photos')) as $directory) {
            if ($directory === '.' || $directory === '..') {
                continue;
            }

            $yamlPath = resource_path('legacy-photos/'.$directory.'/index.yaml');
            $data = Yaml::parse(file_get_contents($yamlPath));

            self::optimizeThumbnail(
                public_path($data['photo']),
                $thumbnailFilename = md5($data['photo']).'-thumbnail.jpg'
            );

            self::optimizeFullSize(
                public_path($data['photo']),
                $displayFilename = md5($data['photo']).'-display.jpg'
            );

            $photos[] = [
                'date' => $data['date'],
                'caption' => $data['caption'] ?? null,
                'thumbnail_url' => Storage::url($thumbnailFilename),
                'url' => Storage::url($displayFilename),
            ];
        }

        return $photos;
    }

    public static function icloudPhotos()
    {
        $BASE = config('services.icloud.base_url');

        $photos = [];

        $webstream = Http::post($BASE.'/sharedstreams/webstream', [
            'streamCtag' => null,
        ])->json();
        $photos = collect($webstream['photos']);

        $assets = Http::post($BASE.'/sharedstreams/webasseturls', [
            'photoGuids' => $photos->pluck('photoGuid'),
        ])->json();

        $photos = $photos->map(function ($photo) use ($assets) {
            $checksum = self::calculateChecksum($photo);
            $asset = $assets['items'][$checksum];

            $id = $photo['photoGuid'];

            if (str($photo['caption'])->contains(':')) {
                $date = str($photo['caption'])->before(':')->trim();
                $caption = str($photo['caption'])->after(':')->trim();
            } else {
                $date = $photo['caption'];
                $caption = null;
            }

            $icloudUrl = 'https://'.$asset['url_location'].$asset['url_path'];

            $extension = str($asset['url_path'])->lower()->contains('mp4')
                ? 'mp4'
                : 'jpg';

            $filename = $id.'.'.$extension;

            if (! Storage::exists($filename)) {
                if ($extension === 'mp4') {
                    // Videos are so rare that we assume they already don't have exif data. Use `exiftool` locally.
                    Storage::put($filename, file_get_contents($icloudUrl));
                } else {
                    // uniqid() is used so that people can't catch the file publicly exposed as it's processing.
                    $imageWithExifFilename = $id.'-'.uniqid().'-dangerous.jpg';
                    Storage::put($imageWithExifFilename, file_get_contents($icloudUrl));

                    // Strip exif data (GPS location, etc) for privacy.
                    $image = imagecreatefromjpeg(Storage::path($imageWithExifFilename));
                    imagejpeg($image, Storage::path($filename), 100);
                    imagedestroy($image);
                    Storage::delete($imageWithExifFilename);
                }
            }

            self::optimizeThumbnail(
                Storage::path($filename),
                $thumbnailFilename = $id.'-thumbnail.'.$extension
            );

            self::optimizeFullSize(
                Storage::path($filename),
                $displayFilename = $id.'-display.'.$extension
            );

            return [
                'date' => $date,
                'caption' => $caption,
                'thumbnail_url' => Storage::url($thumbnailFilename),
                'url' => Storage::url($displayFilename),
            ];
        });

        return $photos;
    }

    private static function calculateChecksum($photo)
    {
        $maxFileSize = 0;
        $maxFileSizeChecksum = null;

        foreach ($photo['derivatives'] as $derivative) {
            if ($derivative['fileSize'] > $maxFileSize) {
                $maxFileSize = $derivative['fileSize'];
                $maxFileSizeChecksum = $derivative['checksum'];
            }
        }

        return $maxFileSizeChecksum;
    }

    private static function optimizeThumbnail($originalPath, $optimizedPath)
    {
        if (self::isVideo($originalPath)) {
            return;
        }

        if (! Storage::exists($optimizedPath)) {
            Image::load($originalPath)
                ->fit(Fit::Crop, 200, 200)
                ->save(Storage::path($optimizedPath));
        }
    }

    private static function optimizeFullSize($originalPath, $optimizedPath)
    {
        if (self::isVideo($originalPath)) {
            copy($originalPath, Storage::path($optimizedPath));
            return;
        }

        if (! Storage::exists($optimizedPath)) {
            Image::load($originalPath)
                ->fit(Fit::Max, 2000, 2000)
                ->quality(90)
                ->save(Storage::path($optimizedPath));
        }
    }

    private static function isVideo($path)
    {
        return str($path)->endsWith('.mp4');
    }
}
