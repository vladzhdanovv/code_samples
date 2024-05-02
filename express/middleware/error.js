export const errorMiddleware = ( error, request, response, next ) => {
  const status = error.statusCode || 500;
  const message = error.message || 'Something went wrong';
  response
    .status( status )
    .send( {
      status,
      message,
    } );
};