describe('k8s.k8sDocker', function() {
  'use strict';

  var k8sDocker;

  beforeEach(module('k8s'));
  beforeEach(inject(function(_k8sDocker_) {
    k8sDocker = _k8sDocker_;
  }));

  describe('#getStatus', function() {
    it('returns falsy when pod has no container status with given name', function () {
      expect(k8sDocker.getStatus(
        // pod
        {
          status: {
            containerStatuses: [
              {name: 'ACAEB740-01D1-4D43-BB7B-68EBFD484701'},
              {name: '06DB4D15-3A24-482B-82B1-A46337D8C2DD'},
              {name: '7AE75BB5-B562-4D5A-B880-F529797CAD5F'}
            ]
          }
        },

        // container name
        '9242B9F6-A50A-4330-8C0E-B18EA4672A89'
      )).toBeFalsy();
    });

    it('returns container status with given name', function () {
      expect(k8sDocker.getStatus(
        // pod
        {
          status: {
            containerStatuses: [
              {name: 'ACAEB740-01D1-4D43-BB7B-68EBFD484701'},
              {name: '9242B9F6-A50A-4330-8C0E-B18EA4672A89', status: 'running'},
              {name: '7AE75BB5-B562-4D5A-B880-F529797CAD5F'}
            ]
          }
        },

        // container name
        '9242B9F6-A50A-4330-8C0E-B18EA4672A89'
      )).toEqual({name: '9242B9F6-A50A-4330-8C0E-B18EA4672A89', status: 'running'})
    });
  });

  describe('#isEnvVarEmpty', function () {
    it('returns false when env var has non-falsy name', function () {
      expect(k8sDocker.isEnvVarEmpty({name: 'PORT', value: 3000})).toEqual(false);
    });

    it('returns true when env var has falsy name', function () {
      expect(k8sDocker.isEnvVarEmpty({name: '', value: 3000})).toEqual(true);
    });
  });

  describe('#isVolumeMountEmpty', function () {
    it('returns false when volume mount has both non-falsy name and mount path', function () {
      expect(k8sDocker.isVolumeMountEmpty({name: 'grafana', mountPath: '/var/lib/grafana'})).toEqual(false);
    });

    it('returns true when volume mount has falsy name', function () {
      expect(k8sDocker.isVolumeMountEmpty({name: '', mountPath: '/var/lib/grafana'})).toEqual(true);
    });

    it('returns true when volume mount has falsy mount path', function () {
      expect(k8sDocker.isVolumeMountEmpty({name: 'grafana', mountPath: ''})).toEqual(true);
    });
  });

  describe('#isPortEmpty', function () {
    it('returns false when port has both non-falsy name and container port', function () {
      expect(k8sDocker.isPortEmpty({name: 'HTTP', containerPort: 80})).toEqual(false);
    });

    it('returns true when port has falsy name', function () {
      expect(k8sDocker.isPortEmpty({name: '', containerPort: 80})).toEqual(true);
    });

    it('returns true when port has nully container port', function () {
      expect(k8sDocker.isPortEmpty({name: 'HTTP', containerPort: null})).toEqual(true);
    });
  });
});