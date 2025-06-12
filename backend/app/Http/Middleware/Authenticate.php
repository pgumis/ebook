<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        // Jeśli żądanie oczekuje odpowiedzi JSON (co jest prawdą dla API),
        // nie przekierowuj nigdzie, tylko pozwól Laravelowi zwrócić błąd 401.
        if ($request->expectsJson()) {
            return null;
        }

        // W przeciwnym wypadku (dla zwykłych stron web), przekieruj do logowania.
        return route('login');
    }
}
