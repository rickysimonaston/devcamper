const advancedResults = (model, populate) => async (req, res, next) => {
    let query;
    // Copy the request object query
    const reqQuery = {
        ...req.query,
    };
    // Array fields excluded
    const removeFields = ['select', 'sort', 'limit', 'page'];
    // Loop over Remove fields and delete them from request query
    removeFields.forEach(param => delete reqQuery[param]);
    // Creates query string using the request data
    let queryStr = JSON.stringify(reqQuery);
    // Modifying the query to include the $gt $gte to match mongoose
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    // Query to the Database
    query = model.find(JSON.parse(queryStr));
    // Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join('');
        query = query.select(fields);
    }
    // Sort field
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join('');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    // Create query for pagination
    query = query.skip(startIndex).limit(limit);

    // Add populate function to query
    if (populate) {
        query = query.populate(populate);
    }
    // Data back from the database
    const results = await query;
    // Pagination Results
    const pagination = {};
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        };
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        };
    }

    res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results
    }

    next();
}

module.exports = advancedResults;