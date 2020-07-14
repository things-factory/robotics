import { expect } from 'chai'
import math3d from 'math3d'

function convertXYZABCtoHM(xyzabc) {
  var H = math3d.Matrix4x4
  var [x,y,z,a,b,c] = xyzabc
  a = a*Math.PI/180
  b = b*Math.PI/180
  c = c*Math.PI/180
  var ca = Math.cos(a)
  var sa = Math.sin(a)
  var cb = Math.cos(b)
  var sb = Math.sin(b)
  var cc = Math.cos(c)
  var sc = Math.sin(c)    
  H = new math3d.Matrix4x4([cb*cc, cc*sa*sb - ca*sc, sa*sc + ca*cc*sb, x, cb*sc, ca*cc + sa*sb*sc, ca*sb*sc - cc*sa, y, -sb, cb*sa, ca*cb, z, 0,0,0,1])
  return H
}

function convertHMtoXYZABC(hm) {
  var H = math3d.Matrix4x4
  var a = 0.0
  var b = 0.0
  var c = 0.0

  H = hm
  var x = H.m14
  var y = H.m24
  var z = H.m34
  if (H.m31 > (1.0 - 1e-10)) {
    b = -Math.PI/2
    a = 0
    c = Math.atan2(-H.m23, H.m22)
  }
  else if (H.m31 < -1.0 + 1e-10) {
    b = Math.PI/2
    a = 0
    c = Math.atan2(H.m23, H.m22)
  }
  else {
    b = Math.atan2(-H.m31, Math.sqrt(H.m11*H.m11 + H.m21*H.m21))
    c = Math.atan2(H.m21, H.m11)
    a = Math.atan2(H.m32, H.m33)    
  }

  return [x, y, z, a*180/Math.PI, b*180/Math.PI, c*180/Math.PI]
}

function transform(base, offset) {
  var Vector3 = math3d.Vector3
  var Quaternion = math3d.Quaternion
  var Transform = math3d.Transform
  var hmTcp2Base = math3d.Matrix4x4
  var hmToolOffset = math3d.Matrix4x4
  var hmRepos = math3d.Matrix4x4
  var xyzuvw = [0.0, 0.0, 0.0, 0.0, 0.0]

  var [bx, by, bz, bu, bv, bw] = base
  var [ox, oy, oz, ou, ov, ow] = offset

  hmTcp2Base = convertXYZABCtoHM(base)
  hmToolOffset = convertXYZABCtoHM(offset)
  hmRepos = hmTcp2Base.mul(hmToolOffset)
  xyzuvw = convertHMtoXYZABC(hmRepos)

  return xyzuvw
}

describe('Transform', function () {
  before(function () {
  })

  after(function () {
  })

  it('should have an expected result ', function () {
    var base = [0.4462285439792695, -0.07414228467059539, 0.05819768211787435, -3.8335642824988603, 190.42351237184792, -18.225453230706083]
    var offset = [0,0,-0.3,0,0,0]
    var result = transform(base, offset)
    var finalResult = false

    var expected = [0.4913939945495271, -0.11013105498887751, 0.3525866942867451, 176.16643571750112, -10.423512371847911, 161.77454676929392]

    // TODO: why not to use 'equals'? 
    finalResult = (JSON.stringify(result) == JSON.stringify(expected))
    console.log(finalResult)

    expect(finalResult).to.be.true
  })
})
