<?php

use App\Actions\GetPhotos;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('index', [
        'photos' => Cache::get('photos', []),
    ]);
});
