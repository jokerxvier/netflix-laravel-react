<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserMovieList extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'movie_id',
        'movie_title',
        'movie_poster_path',
        'movie_backdrop_path',
        'movie_overview',
        'movie_release_date',
        'media_type',
    ];

    /**
     * Get the user that owns the movie list item.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
} 