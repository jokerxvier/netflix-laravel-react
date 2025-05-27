<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserMovieLike extends Model
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

    protected $casts = [
        'movie_id' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
} 