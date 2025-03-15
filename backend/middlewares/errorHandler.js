
const errorHandler = (error, req, res, next) => {
    console.log(error);
    console.log(error.details);

    // if (error.name == '') {
    //     return res.status(400).json({
    //         message: error.message,
    //         details: error.details
    //     });
    // }

    return res.status(error.statusCode || 500).json({
        error: "Internal Server Error",
        message: error.message,
    });
};

module.exports = { errorHandler };