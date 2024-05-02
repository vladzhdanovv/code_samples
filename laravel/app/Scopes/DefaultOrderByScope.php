<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class DefaultOrderByScope implements Scope
{
    public function __construct(
        protected string $column = 'created_at',
        protected string $direction = 'asc'
    ) {
    }

    public function apply(Builder $builder, Model $model)
    {
        $builder->orderBy($this->column, $this->direction);
    }
}
