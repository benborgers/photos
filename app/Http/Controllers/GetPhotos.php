<?php

namespace App\Http\Controllers;

class GetPhotos extends Controller
{
    public function __invoke()
    {
        return response()->json(['res' => true]);
    }
}
