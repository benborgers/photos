<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class ClearStorage extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:clear-storage';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clears all storage. This is safe as long as all stored items are derived (from filesystem or iCloud shared album).';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        Storage::deleteDirectory('.');
    }
}
