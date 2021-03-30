const advancedResult = (model, populate) => async (req, res, next) => {
     let query;

     // copy req.query
     const requestQuery = { ...req.query };

     // Fileds to exclude
     const removeFields = ['select', 'sort', 'page', 'limit'];

     // Loop over removeFields and delete them fom requestQuery
     removeFields.forEach(param => delete requestQuery[param]);

     // Create query string
     let queryString = JSON.stringify(requestQuery);

     // Create operators
     queryString = queryString.replace(/\b(gt|gte|le|lte|in)\b/g, match => `$${match}`);

     // Finding resource
     query = model.find(JSON.parse(queryString));

     // Select Fields
     if (req.query.select) {
          const fields = req.query.select.split[','].join(' ');
          query = query.select(fields);
     }

     // Sort
     if (req.query.sort) {
          const sortBy = req.query.sort.split[','].join(' ');
          query = query.sort(sortBy)
     }
     else {
          // default sort
          query = query.sort('-createdAt');
     }

     // get total query count
     const total = await query.countDocuments();

     // Pagination
     const page = parseInt(req.query.page, 10) || 1;
     const limit = parseInt(req.query.limit, 10) || 25;
     const startIndex = (page - 1) * limit;
     const endIndex = page * limit;

     query = query.skip(startIndex).limit(limit);

     if(populate){
          query = query.populate(populate);
     }

     // Executing query
     const results = await query;

     // Pagination Result
     const pagination = {};

     if (endIndex < total) {
          pagination.next = {
               page: page + 1,
               limit
          }
     }
     if (startIndex > 0) {
          pagination.prev = {
               page: page - 1,
               limit
          }
     }
     res.advancedResult = {
          success: true,
          count: total,
          pagination,
          data: results
     }

     next();
};

export default advancedResult;