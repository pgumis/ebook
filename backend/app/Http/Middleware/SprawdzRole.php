<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SprawdzRole
{
    public function handle(Request $request, Closure $next, ...$role)
    {
        $uzytkownik = $request->user();

        if (!$uzytkownik || !in_array($uzytkownik->rola, $role)) {
            return response()->json(['message' => 'Brak dostępu.'], 403);
        }

        return $next($request);
    }
}
