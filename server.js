// service.js
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const ApiError = require('./utils/apiError');
const globalError = require('./middlewares/errorMiddleware');
// Correct import statement for named export
const { dbConnection } = require('./config/database');
const subCategoryRoute = require('./routes/subCategoryRout');
const categoryRoute = require('./routes/categoryRoute');
const myClothRoute = require('./routes/myClothRoute');
const userRoute = require('./routes/userRoute');
const authRoute = require('./routes/authRoute');
const uploadRoute = require('./routes/routeUpload');

dotenv.config({ path: 'config.env' });

// Call dbConnection function to connect to the database
dbConnection();

const app = express();

// Enable CORS
app.use(cors());

// Compress all responses
app.use(compression());

app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(`mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
app.use('/api/vi/categories', categoryRoute);
app.use('/api/vi/subcategories', subCategoryRoute);
app.use('/api/vi/users', userRoute);
app.use('/api/vi/auth', authRoute);
app.use('/api/vi/myclothes', myClothRoute); // Corrected route path
app.use('/api/vi/upload', uploadRoute);
// Route not found error handler
app.all('*', (req, res, next) => {
    next(new ApiError(`Can't find this route: ${req.originalUrl}`, 404));
});

// Global error handling middleware
app.use(globalError);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});
