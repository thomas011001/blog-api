async function paginate(
  model,
  { page = 1, limit = 10, where = {}, orderBy = {}, select = null }
) {
  const skip = (page - 1) * limit;

  try {
    const [data, total] = await Promise.all([
      model.findMany({
        skip,
        take: limit,
        where,
        orderBy,
        select,
      }),
      model.count({ where }),
    ]);

    return {
      data,
      meta: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        perPage: limit,
      },
    };
  } catch (e) {
    throw e;
  }
}

export default paginate;
