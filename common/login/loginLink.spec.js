describe('login link', function () {
  var $rootScope, scope, link, login;
  beforeEach(module('login/loginLink.tpl.html', 'login'));

  beforeEach(inject(function (_$rootScope_, $compile, _login_) {
    $rootScope = _$rootScope_;
    login = _login_;
    link = $compile('<li login-link></li>')($rootScope);
    $rootScope.$digest();
    scope = link.scope();
    angular.element(document.body).append(link);
  }));
  it('should have a dummy test', inject(function () {
    expect(true).toBeTruthy();
  }));

  afterEach(function () {
    link.remove();
  });

  it('should attach stuff to the scope', inject(function ($compile, $rootScope) {
    expect(scope.user).toBeDefined();
    expect(scope.isAuthenticated).toBe(login.isAuthenticated);
    expect(scope.logout).toBe(login.logout);
  }));

  it('should display login when user is not authenticated', function () {
    expect(link.find('a:visible').text()).toBe(String.fromCharCode(0xA0) + 'Login');
    expect(link.find('a:hidden').text()).toBe(String.fromCharCode(0xA0) + 'Logout');
  });

  it('should display logout when user is authenticated', function () {
    login.user = {};
    $rootScope.$digest();
    expect(link.find('a:visible').text()).toBe(String.fromCharCode(0xA0) + 'Logout');
    expect(link.find('a:hidden').text()).toBe(String.fromCharCode(0xA0) + 'Login');
  });

  it('should call logout when the logout link is clicked', function () {
    spyOn(scope, 'logout');
    link.find('.logout').click();
    expect(scope.logout).toHaveBeenCalled();
  });

});