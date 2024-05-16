<?php

namespace App\Actions;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Yaml\Yaml;

class GetPhotos
{
    public static function call()
    {
        return [
            ...self::legacyPhotos(),
            ...self::icloudPhotos(),
        ];
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

            $photos[] = [
                'date' => $data['date'],
                'caption' => $data['caption'] ?? null,
                'url' => url($data['photo']),
            ];
        }

        return $photos;
    }

    public static function icloudPhotos()
    {
        $BASE = 'https://p28-sharedstreams.icloud.com/B0S5Uzl7VG2pWXt';

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

            $filename = $id.'.jpg';

            if (! Storage::exists($filename)) {
                $file = Storage::put($filename, file_get_contents($icloudUrl));
            }

            $url = Storage::url($filename);

            return compact('date', 'caption', 'url');
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
}
