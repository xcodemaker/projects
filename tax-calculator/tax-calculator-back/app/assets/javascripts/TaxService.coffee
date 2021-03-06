class TaxService

  @headers = {'Accept': 'application/json', 'Content-Type': 'application/json'}
  @defaultConfig = { headers: @headers }

  constructor: (@$log, @$http, @$q) ->
    @$log.debug "constructing UserService"

  getTax: (form) ->
    @$log.debug "TaxService.getTax()"
    deferred = @$q.defer()

    # create deep copy from form
    params = $.extend(true, {}, form);
    params.salary = params.salary

    @$http.get("/tax", {params: params})
    .success((data, status, headers) =>
      @$log.info("Successfully got tax - status #{status}")
      deferred.resolve(data)
    )
    .error((data, status, headers) =>
      @$log.error("Failed to get tax - status #{status}")
      deferred.reject(data)
    )


    deferred.promise

  listUsers: () ->
    @$log.debug "listUsers()"
    deferred = @$q.defer()

    @$http.get("/users")
    .success((data, status, headers) =>
      @$log.info("Successfully listed Users - status #{status}")
      deferred.resolve(data)
    )
    .error((data, status, headers) =>
      @$log.error("Failed to list Users - status #{status}")
      deferred.reject(data)
    )
    deferred.promise

  createUser: (user) ->
    @$log.debug "createUser #{angular.toJson(user, true)}"
    deferred = @$q.defer()

    @$http.post('/user', user)
    .success((data, status, headers) =>
      @$log.info("Successfully created User - status #{status}")
      deferred.resolve(data)
    )
    .error((data, status, headers) =>
      @$log.error("Failed to create user - status #{status}")
      deferred.reject(data)
    )
    deferred.promise

  updateUser: (firstName, lastName, user) ->
    @$log.debug "updateUser #{angular.toJson(user, true)}"
    deferred = @$q.defer()

    @$http.put("/user/#{firstName}/#{lastName}", user)
    .success((data, status, headers) =>
      @$log.info("Successfully updated User - status #{status}")
      deferred.resolve(data)
    )
    .error((data, status, header) =>
      @$log.error("Failed to update user - status #{status}")
      deferred.reject(data)
    )
    deferred.promise

servicesModule.service('TaxService', TaxService)