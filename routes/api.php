<?php

use App\Http\Controllers;
use Illuminate\Support\Facades\Route;

Route::get('/photos', Controllers\GetPhotos::class);
