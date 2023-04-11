module.exports = {
  OK: 200, // The request was successfully completed.
  CREATED: 201, // A new resource was successfully created.
  OK_AND_COMPLETED: 202, // The request was successful and detailed are completed
  OK_WITH_CONFLICT: 203, // The request was successful but with some conflict
  PROMPT_CODE: 204, // The request was successful but with prompt
  SEE_OTHER: 303, // This can be the URI of a temporary status message, or the URI to some already existing, more permanent, resource.
  BAD_REQUEST: 400, // The request was invalid.
  UNAUTHORIZED: 401, // The request did not include an authentication token or the authentication token was expired.
  FORBIDDEN: 403, // The client did not have permission to access the requested resource.
  NOT_FOUND: 404, // The requested resource was not found.
  METHOD_NOT_ALLOWED: 405, // The HTTP method in the request was not supported by the resource. For example, the DELETE method cannot be used with the Agent API.
  INVALID_ID: 406, // The request with id do not exist in database
  CONFLICT: 409, // The request could not be completed due to a conflict. For example,  POST ContentStore Folder API cannot complete if the given file or folder name already exists in the parent location.
  PRECONDITION_FAILED: 412, // The code indicates that those preconditions were not met
  INTERNAL_SERVER_ERROR: 500, // The request was not completed due to an internal error on the server side.
  SERVICE_UNAVAILABLE: 503, // The server was unavailable.
  GATEWAY_TIMEOUT: 504, // The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.
  INSUFFICIENT_STORAGE: 507, // The server is unable to store the representation needed to complete the request.
  NETWORK_AUTHENTICATION_REQUIRED: 511, // Network error
};
