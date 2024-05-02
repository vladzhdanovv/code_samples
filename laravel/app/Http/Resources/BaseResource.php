<?php

namespace App\Http\Resources;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Model */
class BaseResource extends JsonResource
{
    public function withResourceName(array $result): array
    {
        return ['resource' => class_basename($this)] + $result;
    }
}
