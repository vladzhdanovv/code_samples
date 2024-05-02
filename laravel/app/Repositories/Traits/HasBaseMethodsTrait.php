<?php

namespace App\Repositories\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

trait HasBaseMethodsTrait
{
    /**
     * Get by id.
     */
    public function find(int $id): ?Model
    {
        return $this->model->find($id);
    }

    /**
     * Create.
     */
    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    /**
     * Update by id.
     */
    public function update(int $id, array $data): bool
    {
        $fillable = $this->model->getFillable();

        $data = array_filter($data, function ($key) use ($fillable) {
            return array_search($key, $fillable) !== false;
        }, ARRAY_FILTER_USE_KEY);

        return (bool) $this->model->where('id', $id)->update($data);
    }

    /**
     * Delete by id.
     */
    public function delete(int $id): bool
    {
        return (bool) $this->model->destroy($id);
    }

    /**
     * Determine if a row exists by id.
     */
    public function exists(int $id): bool
    {
        return $this->model->where('id', $id)->exists();
    }

    /**
     * Get all.
     */
    public function all(int $offset = null, int $limit = null): Collection
    {
        $query = $this->model->query();

        if ($offset) {
            $query->offset($offset);
        }

        if ($limit) {
            $query->limit($limit);
        }

        return $query->get();
    }

    public function prepareQueryForGet(
        array $params = [],
        array $select = [],
        array $relation = [],
        array $where = [],
        array $whereIn = [],
        array $whereHas = [],
        Model $model = null,
    ): Builder {
        $model = $model ?? $this->model;

        $query = $model->newQuery();

        if (! empty($whereHas)) {
            foreach ($whereHas as $relation => $closureOrRelation) {
                if (is_numeric($relation)) {
                    $query = $query->whereHas($closureOrRelation);
                } else {
                    $query = $query->whereHas($relation, $closureOrRelation);
                }
            }
        }

        if (! empty($where)) {
            $query = $query->where($where);
        }

        if (isset($whereIn['field'], $whereIn['values']) && $whereIn['field'] && $whereIn['values']) {
            $query = $query->whereIn($whereIn['field'], $whereIn['values']);
        }

        if (! empty($relation)) {
            $query = $query->with($relation);
        }

        if (! empty($select)) {
            $selectedColumns = array_unique($select);

            $query->select($selectedColumns);
        }

        if (isset($params['sort']) && $params['sort']) {
            $order = (array_key_exists('order', $params) && $params['order'] === 'asc') ? 'asc' : 'desc';
            $query->orderBy($params['sort'], $order);
        }

        return $query;
    }
}
