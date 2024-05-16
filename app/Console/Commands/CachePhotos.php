<?php

namespace App\Console\Commands;

use App\Jobs\CachePhotos as CachePhotosJob;
use Illuminate\Console\Command;

class CachePhotos extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:cache-photos';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cache photos';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        CachePhotosJob::dispatch();
    }
}
