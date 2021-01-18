/* eslint-disable */
import { svgAvatarsOptions } from "./svgavatars.defaults"
import { svgAvatarsTranslation } from "./languages/svgavatars.en"

export function initAvatars(initialState, initialStateColors, unlockedBodyZoneShapes, userXP, onClickLockedShape, saveFunction, SVG, color, colorsSetFunction) {
  var a = window.jQuery
  var c = svgAvatarsOptions()

  // API config. Change when testing locally
  //var API = "https://heroengineer.com:8082/api"
  var API = "http://localhost:8081/api"
  var colors = {}

  // Fetch avatar data
  a.ajax({
    url: API + c.pathToFolder + "json/svgavatars-data",
    dataType: "json",
    cache: !0,
    global: !1
  })
    .done(function(boysData) {
      applyData("boys", boysData)
      applyInitialState(initialState, initialStateColors)
    })
    .fail(function() {
      a("#svga-message-text")
        .html(f.alertJsonError)
        .addClass("svga-error")
      a("#svga-loader").hide()
      a("#svga-work-overlay").fadeIn("fast")
      a("#svga-message").fadeIn("fast")
    })

  function applyData(gender, bodyZoneConfig) {
    function addMovingAndScalingDataAttributes() {
      function setDataAttributesForMoving(node) {
        let attributes = ["updown", "leftright", "rotate"];
        for (let i = 0; i < attributes.length; i++) {
          node.data(attributes[i], 0)
        }
        node.attr("transform", "matrix(1,0,0,1,0,0)")
      }

      function setDataAttributesForScaling(node) {
        let attributes = ["scaleX", "scaleY"];
        for (let i = 0; i < attributes.length; i++) {
          node.data(attributes[i], 1)
        }
        node.attr("transform", "matrix(1,0,0,1,0,0)")
      }

      /*
      var e = b("svga-svgmain").attr({
        id: "svga-svgcanvas",
        width: null,
        height: null,
        class: "svga-svg",
        viewBox: "0 0 200 200",
        preserveAspectRatio: "xMinYMin meet"
      })
      e = e.group().attr("id", "svga-group-wrapper")
      e.group().attr("id", "svga-group-backs-single")
      e = e.group().attr("id", "svga-group-humanwrap-move")
      setDataAttributesForMoving(e)
      e = e.group().attr("id", "svga-group-humanwrap")
      setDataAttributesForScaling(e)
      var d = e.group().attr("id", "svga-group-hair-back-move")
      setDataAttributesForMoving(d)
      d = d.group().attr("id", "svga-group-hair-back")
      setDataAttributesForScaling(d)
      e.group().attr("id", "svga-group-humanbody-single")
      e.group().attr("id", "svga-group-chinshadow-single")
      e.group().attr("id", "svga-group-clothes-single")
      var f = e.group().attr("id", "svga-group-head")
      setDataAttributesForMoving(f)
      d = e.group().attr("id", "svga-group-ears-left-move")
      setDataAttributesForMoving(d)
      f.add(d)
      d = d.group().attr("id", "svga-group-ears-left")
      setDataAttributesForScaling(d)
      d = e.group().attr("id", "svga-group-ears-right-move")
      setDataAttributesForMoving(d)
      f.add(d)
      d = d.group().attr("id", "svga-group-ears-right")
      setDataAttributesForScaling(d)
      d = e.group().attr("id", "svga-group-faceshape-wrap")
      setDataAttributesForScaling(d)
      f.add(d)
      d.group().attr("id", "svga-group-faceshape-single")
      d = e.group().attr("id", "svga-group-mouth-single-move")
      setDataAttributesForMoving(d)
      f.add(d)
      d = d.group().attr("id", "svga-group-mouth-single")
      setDataAttributesForScaling(d)
      d = e.group().attr("id", "svga-group-eyes-left-move")
      setDataAttributesForMoving(d)
      f.add(d)
      d = d.group().attr("id", "svga-group-eyes-left")
      setDataAttributesForScaling(d)
      d.group().attr("id", "svga-group-eyesback-left")
      var h = d.group().attr("id", "svga-group-eyesiriswrapper-left")
      h = h.group().attr("id", "svga-group-eyesiriscontrol-left")
      setDataAttributesForMoving(h)
      h = h.group().attr("id", "svga-group-eyesiris-left")
      setDataAttributesForScaling(h)
      d.group().attr("id", "svga-group-eyesfront-left")
      d = e.group().attr("id", "svga-group-eyes-right-move")
      setDataAttributesForMoving(d)
      f.add(d)
      d = d.group().attr("id", "svga-group-eyes-right")
      setDataAttributesForScaling(d)
      d.group().attr("id", "svga-group-eyesback-right")
      h = d.group().attr("id", "svga-group-eyesiriswrapper-right")
      h = h.group().attr("id", "svga-group-eyesiriscontrol-right")
      setDataAttributesForMoving(h)
      h = h.group().attr("id", "svga-group-eyesiris-right")
      setDataAttributesForScaling(h)
      d.group().attr("id", "svga-group-eyesfront-right")
      f.group().attr("id", "svga-group-facehighlight-single")
      d = f.group().attr("id", "svga-group-eyebrows-left-move")
      setDataAttributesForMoving(d)
      d = d.group().attr("id", "svga-group-eyebrows-left-rotate")
      setDataAttributesForMoving(d)
      d = d.group().attr("id", "svga-group-eyebrows-left")
      setDataAttributesForScaling(d)
      d = f.group().attr("id", "svga-group-eyebrows-right-move")
      setDataAttributesForMoving(d)
      d = d.group().attr("id", "svga-group-eyebrows-right-rotate")
      setDataAttributesForMoving(d)
      d = d.group().attr("id", "svga-group-eyebrows-right")
      setDataAttributesForScaling(d)
      d = f.group().attr("id", "svga-group-nose-single-move")
      setDataAttributesForMoving(d)
      d = d.group().attr("id", "svga-group-nose-single")
      setDataAttributesForScaling(d)
      d = f.group().attr("id", "svga-group-beardwrap")
      setDataAttributesForScaling(d)
      d = d.group().attr("id", "svga-group-beard-single-move")
      setDataAttributesForMoving(d)
      d = d.group().attr("id", "svga-group-beard-single")
      setDataAttributesForScaling(d)
      d = f.group().attr("id", "svga-group-mustache-single-move")
      setDataAttributesForMoving(d)
      d = d.group().attr("id", "svga-group-mustache-single")
      setDataAttributesForScaling(d)
      d = f.group().attr("id", "svga-group-hair-front")
      setDataAttributesForScaling(d)
      d = f.group().attr("id", "svga-group-glasses-single-move")
      setDataAttributesForMoving(d)
      d = d.group().attr("id", "svga-group-glasses-single")
      setDataAttributesForScaling(d)
       */
    }


    function D(a, b, e) {
      a = Q(a).toHsv()
      a.s += b
      0 > a.s && (a.s = 0)
      1 < a.s && (a.s = 1)
      a.v += e
      0 > a.v && (a.v = 0)
      1 < a.v && (a.v = 1)
      return Q(a).toHexString()
    }

    function L(a) {
      a = Q(a).toHexString()
      switch (activeBodyZone) {
        case "faceshape":
          var g = "faceshape humanbody chinshadow facehighlight ears mouth nose eyesfront".split(
            " "
          )
          color(g, a)
          break
        case "ears":
          g = "faceshape humanbody chinshadow facehighlight ears mouth nose eyesfront".split(
            " "
          )
          color(g, a)
          break
        case "nose":
          g = "faceshape humanbody chinshadow facehighlight ears mouth nose eyesfront".split(
            " "
          )
          color(g, a)
          break
        default:
          ;(g = [activeBodyZone]), color(g, a)
      }
    }

    if ("boys" === gender) {
      var bodyPartColorMappings = {
        backs: "#ecf0f1",
        humanbody: "#f0c7b1",
        clothes: "#386e77",
        hair: "#2a232b",
        ears: "#f0c7b1",
        faceshape: "#f0c7b1",
        chinshadow: "#f0c7b1",
        facehighlight: "#f0c7b1",
        eyebrows: "#2a232b",
        eyesback: "#000000",
        eyesfront: "#000000",
        eyesiris: "#4e60a3",
        glasses: "#26120B",
        mustache: "#2a232b",
        beard: "#2a232b",
        mouth: "#da7c87"
      }
    } else if ("girls" === gender)
      bodyPartColorMappings = {
        backs: "#ecf0f1",
        humanbody: "#F3D4CF",
        clothes: "#09aac5",
        hair: "#2a232b",
        ears: "#F3D4CF",
        faceshape: "#F3D4CF",
        chinshadow: "#F3D4CF",
        facehighlight: "#F3D4CF",
        eyebrows: "#2a232b",
        eyesback: "#000000",
        eyesfront: "#000000",
        eyesiris: "#4e60a3",
        glasses: "#26120B",
        mouth: "#f771a9"
      }
    else return
    //var blocks = ["face", "eyes", "hair", "clothes", "backs"]
    var bodyZones = "backs faceshape chinshadow facehighlight humanbody clothes hair ears eyebrows eyesback eyesiris eyesfront glasses mouth mustache beard nose".split(" ")
    var selectedAvatarElements = {},
      x = {
        up:
          "M8.425,3.176c-0.235-0.234-0.614-0.234-0.849,0L2.769,7.984c-0.235,0.234-0.235,0.613,0,0.85l0.565,0.564c0.234,0.235,0.614,0.235,0.849,0L7,6.58V12.4C7,12.732,7.268,13,7.6,13H8.4C8.731,13,9,12.73,9,12.4V6.58l2.818,2.819c0.234,0.234,0.614,0.234,0.849,0l0.565-0.566c0.234-0.234,0.234-0.613,0-0.848L8.425,3.176z",
        down:
          "M7.575,12.824c0.235,0.234,0.614,0.234,0.849,0l4.808-4.809c0.235-0.234,0.235-0.613,0-0.85l-0.565-0.564c-0.234-0.235-0.614-0.235-0.849,0L9,9.42V3.6C9,3.268,8.732,3,8.4,3H7.6C7.269,3,7,3.27,7,3.6v5.82L4.182,6.602c-0.234-0.234-0.615-0.234-0.849,0L2.768,7.168c-0.234,0.234-0.234,0.613,0,0.848L7.575,12.824z",
        left:
          "M3.176,7.575c-0.234,0.235-0.234,0.614,0,0.849l4.809,4.808c0.234,0.235,0.613,0.235,0.85,0l0.564-0.565c0.235-0.234,0.235-0.614,0-0.849L6.58,9H12.4C12.732,9,13,8.732,13,8.4V7.6C13,7.269,12.73,7,12.4,7H6.58l2.819-2.818c0.234-0.234,0.234-0.615,0-0.849L8.832,2.768c-0.234-0.234-0.613-0.234-0.848,0L3.176,7.575z",
        right:
          "M12.824,8.425c0.234-0.235,0.234-0.614,0-0.849L8.016,2.769c-0.234-0.235-0.613-0.235-0.85,0L6.602,3.334c-0.235,0.234-0.235,0.614,0,0.849L9.42,7H3.6C3.268,7,3,7.268,3,7.6V8.4C3,8.731,3.27,9,3.6,9h5.82l-2.818,2.818c-0.234,0.234-0.234,0.614,0,0.849l0.566,0.565c0.234,0.234,0.613,0.234,0.848,0L12.824,8.425z",
        tightly:
          "M12.594,8l3.241,3.205c0.22,0.216,0.22,0.567,0,0.783l-0.858,0.85c-0.219,0.217-0.575,0.217-0.795,0L9.683,8.393c-0.221-0.216-0.221-0.568,0-0.785l4.499-4.445c0.22-0.217,0.576-0.217,0.795,0l0.858,0.849c0.22,0.217,0.22,0.568,0,0.785L12.594,8z M0.164,11.205c-0.219,0.216-0.219,0.567,0,0.783l0.859,0.85c0.221,0.217,0.575,0.217,0.795,0l4.499-4.445c0.22-0.217,0.22-0.568,0-0.785L1.818,3.163c-0.221-0.217-0.576-0.217-0.795,0L0.164,4.012c-0.219,0.217-0.219,0.568,0,0.785L3.405,8L0.164,11.205z",
        wider:
          "M3.039,8.001l3.203,3.203c0.217,0.216,0.217,0.567,0,0.784l-0.85,0.85c-0.217,0.217-0.567,0.217-0.785,0L0.163,8.393c-0.217-0.216-0.217-0.568,0-0.785l4.444-4.445c0.218-0.217,0.568-0.217,0.785,0l0.85,0.849c0.217,0.217,0.217,0.568,0,0.785L3.039,8.001z M9.758,11.204c-0.217,0.216-0.217,0.567,0,0.784l0.85,0.849c0.217,0.218,0.568,0.218,0.785,0l4.445-4.444c0.217-0.218,0.217-0.568,0-0.785l-4.445-4.445c-0.219-0.217-0.568-0.217-0.785,0l-0.85,0.849c-0.217,0.217-0.217,0.568,0,0.785l3.203,3.204L9.758,11.204z",
        scaledown:
          "M13.974,12.904l-2.716-2.715c-0.222-0.223-0.582-0.223-0.804,0L8.82,8.541c0.708-0.799,1.229-1.865,1.229-3.017C10.049,3.026,8.023,1,5.524,1S1,3.026,1,5.524c0,2.499,2.025,4.524,4.524,4.524c0.899,0,1.791-0.307,2.496-0.758l1.63,1.701c-0.223,0.223-0.223,0.582,0,0.805l2.716,2.717c0.222,0.221,0.582,0.221,0.804,0l0.804-0.805C14.196,13.486,14.196,13.127,13.974,12.904z M5.485,8.461c-1.662,0-3.009-1.378-3.009-3.041s1.347-3.009,3.009-3.009c1.661,0,3.071,1.347,3.071,3.009S7.146,8.461,5.485,8.461z M7.5,6h-4V5h4V6z",
        scaleup:
          "M13.974,12.904l-2.716-2.715c-0.222-0.223-0.582-0.223-0.804,0L8.82,8.541c0.708-0.799,1.229-1.865,1.229-3.016C10.049,3.026,8.023,1,5.524,1S1,3.026,1,5.524c0,2.499,2.025,4.524,4.524,4.524c0.899,0,1.792-0.307,2.496-0.758l1.63,1.701c-0.223,0.223-0.223,0.582,0,0.805l2.716,2.717c0.222,0.221,0.582,0.221,0.804,0l0.804-0.805C14.196,13.486,14.196,13.127,13.974,12.904z M5.485,8.46c-1.662,0-3.009-1.378-3.009-3.04c0-1.662,1.347-3.009,3.009-3.009c1.661,0,3.071,1.347,3.071,3.009C8.557,7.082,7.146,8.46,5.485,8.46z M7.5,6H6v1.5H5V6H3.5V5H5V3.5h1V5h1.5V6z",
        eb1:
          "M5.453,8.316C5.129,7.499,4.146,6.352,1.492,5.521C1.087,5.393,0.868,4.982,1.003,4.602c0.135-0.379,0.572-0.586,0.98-0.458c2.996,0.938,4.917,2.505,5.015,4.088c0.026,0.4-0.3,0.767-0.728,0.767C5.875,8.998,5.531,8.514,5.453,8.316z M9.021,8.313C8.66,8.077,8.593,7.626,8.841,7.301c0.983-1.288,3.5-1.651,6.569-0.948c0.415,0.095,0.669,0.489,0.567,0.877c-0.102,0.39-0.518,0.628-0.937,0.533c-2.718-0.623-4.315-0.188-4.939,0.282C9.908,8.191,9.5,8.625,9.021,8.313z",
        eb2:
          "M9.729,8.998c-0.428,0-0.753-0.366-0.728-0.767c0.098-1.583,2.02-3.149,5.016-4.088c0.407-0.128,0.845,0.079,0.979,0.458c0.136,0.38-0.083,0.792-0.488,0.919c-2.654,0.831-3.638,1.978-3.961,2.796C10.469,8.514,10.125,8.998,9.729,8.998z M5.898,8.045C5.274,7.576,3.677,7.141,0.959,7.764C0.54,7.858,0.124,7.62,0.022,7.23C-0.079,6.842,0.175,6.448,0.59,6.353c3.069-0.703,5.586-0.34,6.569,0.948c0.248,0.325,0.181,0.776-0.18,1.012C6.5,8.625,6.092,8.191,5.898,8.045z",
        eb3:
          "M5.453,8.316C5.129,7.499,4.146,6.352,1.492,5.521C1.087,5.393,0.868,4.982,1.003,4.602c0.135-0.379,0.572-0.586,0.98-0.458c2.996,0.938,4.917,2.505,5.015,4.088c0.026,0.4-0.3,0.767-0.728,0.767C5.875,8.998,5.531,8.514,5.453,8.316z M9.729,8.998c-0.428,0-0.753-0.366-0.728-0.767c0.098-1.583,2.02-3.149,5.016-4.088c0.407-0.128,0.845,0.079,0.979,0.458c0.136,0.38-0.083,0.792-0.488,0.919c-2.654,0.831-3.638,1.978-3.961,2.796C10.469,8.514,10.125,8.998,9.729,8.998z",
        eb4:
          "M5.728,6.662C4.873,6.458,3.369,6.605,1.166,8.303C0.829,8.562,0.367,8.506,0.133,8.176C-0.1,7.848-0.019,7.371,0.32,7.111C2.807,5.195,5.192,4.52,6.545,5.348c0.343,0.208,0.456,0.685,0.211,1.036C6.528,6.708,5.935,6.711,5.728,6.662z M9.244,6.383C8.999,6.033,9.111,5.556,9.455,5.348c1.353-0.828,3.737-0.152,6.225,1.764c0.339,0.26,0.421,0.737,0.187,1.065c-0.233,0.33-0.695,0.386-1.032,0.127c-2.203-1.698-3.707-1.845-4.563-1.641C10.065,6.712,9.471,6.708,9.244,6.383z",
        ebcancel:
          "M11.294,3.091l1.617,1.615c0.119,0.12,0.119,0.315,0,0.436L10.052,8l2.858,2.858c0.12,0.12,0.12,0.314,0.001,0.435l-1.617,1.618c-0.12,0.119-0.314,0.119-0.435-0.001l-2.858-2.859l-2.86,2.86c-0.12,0.119-0.314,0.119-0.435-0.001L3.09,11.293c-0.12-0.12-0.12-0.314,0-0.435L5.949,8L3.09,5.142c-0.12-0.12-0.12-0.315,0-0.436l1.616-1.615c0.12-0.121,0.314-0.121,0.435,0l2.86,2.858l2.858-2.858C10.979,2.97,11.174,2.97,11.294,3.091z",
        tiltleft:
          "M13.399,10h-0.851c-0.165,0-0.299-0.135-0.31-0.3C12.085,7.494,10.244,5.75,8,5.75c-1.393,0-2.627,0.67-3.402,1.705l1.335,1.333C6.049,8.904,6.01,9,5.845,9H2.3C2.135,9,2,8.865,2,8.699V5.156C2,4.99,2.095,4.951,2.212,5.068l1.354,1.354C4.611,5.129,6.208,4.3,8,4.3c3.047,0,5.535,2.393,5.691,5.4C13.7,9.865,13.564,10,13.399,10z",
        tiltright:
          "M2.309,9.7C2.465,6.693,4.953,4.3,8,4.3c1.792,0,3.389,0.829,4.434,2.122l1.354-1.354C13.905,4.951,14,4.99,14,5.156v3.543C14,8.865,13.865,9,13.7,9h-3.545C9.99,9,9.951,8.904,10.067,8.787l1.335-1.333C10.627,6.42,9.393,5.75,8,5.75c-2.244,0-4.085,1.744-4.239,3.95C3.75,9.865,3.616,10,3.451,10h-0.85C2.435,10,2.3,9.865,2.309,9.7z",
        back:
          "M1.17,6.438l4.406,4.428C5.811,11.1,6,11.021,6,10.689V8c0,0,8,0,8,7C14,3,6,4,6,4V1.311c0-0.332-0.189-0.41-0.424-0.176L1.17,5.563C0.943,5.805,0.943,6.197,1.17,6.438z",
        forward:
          "M14.829,6.438l-4.405,4.428C10.189,11.1,10,11.021,10,10.689V8c0,0-8,0-8,7C2,3,10,4,10,4V1.311c0-0.332,0.189-0.41,0.424-0.176l4.405,4.429C15.057,5.805,15.057,6.197,14.829,6.438z",
        random:
          "M24.311,14.514c-0.681,0-1.225,0.553-1.318,1.227c-0.599,4.243-4.245,7.512-8.655,7.512c-2.86,0-6.168-2.057-7.711-4.112l-3.655-4.412c-0.196-0.205-0.547-0.292-0.74-0.131C2.107,14.702,2,14.833,2,14.974v9.503c0,0.339,0.194,0.42,0.436,0.181l2.782-2.782c2.149,2.658,5.436,4.358,9.119,4.358c6.056,0,11.04-4.594,11.657-10.489c0.072-0.678-0.488-1.231-1.169-1.231H24.311z M3.689,13.486c0.681,0,1.225-0.553,1.319-1.227c0.598-4.243,4.245-7.512,8.654-7.512c2.861,0,5.816,1.542,7.71,4.112l3.655,4.412c0.195,0.205,0.547,0.293,0.739,0.13C25.893,13.299,26,13.167,26,13.026V3.522c0-0.339-0.195-0.419-0.437-0.181l-2.782,2.784c-2.149-2.659-5.435-4.36-9.119-4.36c-6.056,0-11.04,4.595-11.656,10.49c-0.072,0.678,0.488,1.231,1.169,1.231H3.689z M15.277,16.982h-1.896l-0.006-0.231c-0.026-1.809,1.087-2.446,2.282-3.581c1.224-1.162-0.229-2.5-1.542-2.339c-0.789,0.097-1.337,0.646-1.574,1.385c-0.166,0.517-0.158,0.653-0.158,0.653l-1.744-0.545c0.051-0.838,0.446-1.583,1.071-2.137c1.202-1.06,3.252-1.16,4.651-0.442c1.418,0.727,2.229,2.522,1.196,3.913C16.638,14.899,15.247,15.266,15.277,16.982z M13.382,19.719v-1.977h1.974v1.977H13.382z",
        reset:
          "M5.515,5.515c-4.686,4.686-4.686,12.284,0,16.971c4.687,4.687,12.284,4.686,16.971,0c4.687-4.687,4.687-12.284,0-16.971C17.799,0.829,10.201,0.828,5.515,5.515z M6.929,6.929C10.595,3.263,16.4,3.04,20.328,6.258L6.257,20.328C3.04,16.4,3.263,10.595,6.929,6.929z M21.071,21.071c-3.667,3.666-9.471,3.89-13.4,0.671l14.071-14.07C24.961,11.601,24.737,17.405,21.071,21.071z",
        save:
          "M25.64,7.142l-4.761-4.779C20.679,2.162,20.282,2,20,2H3.026C2.458,2,2,2.459,2,3.027v21.946C2,25.539,2.458,26,3.026,26h21.947C25.541,26,26,25.539,26,24.974V8.02C26,7.736,25.839,7.341,25.64,7.142z M14,4v5h-4V4H14z M20,24H8v-8h12V24z M24,24h-2v-8.973C22,14.461,21.541,14,20.969,14H7.027C6.458,14,6,14.461,6,15.027V24H4V4h2v4.97C6,9.538,6.458,10,7.027,10h7.862C15.456,10,16,9.538,16,8.97V4h3.146c0.281,0,0.674,0.162,0.873,0.363l3.623,3.257C23.838,7.817,24,8.212,24,8.495V24z M19,18H9v-1h10V18z M19,20H9v-1h10V20z M19,22H9v-1h10V22z",
        download:
          "M28,24.8c0,0.663-0.537,1.2-1.2,1.2H1.2C0.537,26,0,25.463,0,24.8v-4.2C0,20.293,0.297,20,0.6,20H3.4C3.703,20,4,20.293,4,20.6V22h20v-1.4c0-0.307,0.299-0.6,0.601-0.6h2.8c0.302,0,0.6,0.293,0.6,0.6V24.8z M14.873,19.658l8.857-8.811C24.199,10.379,24.043,10,23.379,10H18V3.2C18,2.538,17.463,2,16.801,2H11.2C10.537,2,10,2.538,10,3.2V10H4.621c-0.662,0-0.82,0.379-0.352,0.848l8.855,8.811C13.607,20.113,14.391,20.113,14.873,19.658z"
      },
      T = "up down left right tightly wider scaledown scaleup eb1 eb2 eb3 eb4 ebcancel".split(
        " "
      ),
      K = "up down left right scaledown scaleup tiltleft tiltright".split(" "),
      randomResetSaveControls = "random reset save".split(" "),
      W = ["#19A6CA", "#CB2028"],
      blocksNamesMapping = {
        backs: "backs",
        face: "faceshape",
        eyes: "eyesfront",
        hair: "hair",
        clothes: "clothes"
      },
      onCanvas = false,
      activeBodyZone = "faceshape",
      U,
      q,
      r
    /*
    addMovingAndScalingDataAttributes()
    for (var i = 0; i < blocks.length; i++) {
      a("#svga-blocks").append(
        '<div id="svga-blocks-' + blocks[i] +
        '" class="svga-blocks" data-blockname="' + blocks[i] +
        '">' +
        f.blockTitles[blocks[i]] +
        "</div>"
      )
    }

    a(".svga-blocks:last").addClass("svga-last")

    a("#svga-blocks-backs").data("bodyzones", "backs")
    a("#svga-blocks-face").data("bodyzones", "faceshape,nose,mouth,ears")
    a("#svga-blocks-eyes").data("bodyzones", "eyesfront,eyesiris,eyebrows,glasses")
    a("#svga-blocks-hair").data("bodyzones", "hair,mustache,beard")
    a("#svga-blocks-clothes").data("bodyzones", "clothes")

    for (var bodyZone in bodyPartsConfig) {
      if (bodyPartsConfig.hasOwnProperty(bodyZone)) {
        a("#svga-bodyzones").append(
          '<div id="svga-bodyzones-' +
          bodyZone +
          '" class="svga-bodyzones" data-bodyzone="' +
          bodyZone +
          '" data-controls="' +
          bodyPartsConfig[bodyZone].controls +
          '" data-block="' +
          bodyPartsConfig[bodyZone].block +
          '">' +
          f.bodyZoneTitles[bodyZone] +
          "</div>"
        )
        a("#svga-bodyzones-" + bodyZone).hide()
      }
    }*/
    for (var B in x) {
      x.hasOwnProperty(B) &&
      -1 < T.indexOf(B) &&
      (a("#svga-controls").append(
        '<div id="svga-controls-' +
        B +
        '" class="svga-controls"><svg class="svga-control-icon" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16" preserveAspectRatio="xMinYMin meet"><path class="svga-control-icon-path" d="' +
        x[B] +
        '"/></svg></div>'
      ),
        a("#svga-controls-" + B).hide())
    }
    for (B in x) {
      x.hasOwnProperty(B) &&
      -1 < K.indexOf(B) &&
      a("#svga-glob-controls").append(
        '<div id="svga-glob-controls-' +
        B +
        '" class="svga-glob-controls"><svg class="svga-control-icon" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16" preserveAspectRatio="xMinYMin meet"><path class="svga-control-icon-path" d="' +
        x[B] +
        '"/></svg></div>'
      )
    }
    for (let i = 0; i < randomResetSaveControls.length; i++)
      a("#svga-" + randomResetSaveControls[i] + "avatar > div").append(
        '<svg class="svga-menu-icon" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 28 28" preserveAspectRatio="xMinYMin meet"><path class="svga-menu-icon-path" d="' +
        x[randomResetSaveControls[i]] +
        '"/></svg>'
      )
    var segmentOfShape
    /*
    for (let bodyZone in bodyZoneConfig) {
      if (!bodyZoneConfig.hasOwnProperty(bodyZone)) continue;
      let bodyZoneScaleFactor = bodyZoneConfig[bodyZone].scaleFactor
      let bodyZoneColors = bodyZoneConfig[bodyZone].colors
      //a("#svga-elements").append(
      //  '<div id="svga-elements-' + bodyZone + '"></div>'
      //)
      for (let i = 0; i < bodyZoneConfig[bodyZone].shapes.length; i++) {
        let shape = bodyZoneConfig[bodyZone].shapes[i]
        let locked = false
        let lockedOverlay = ""
        let unlockCost = 0;
        if (shape.unlockInfo && shape.unlockInfo.defaultLocked) {
          if (!unlockedBodyZoneShapes
            || unlockedBodyZoneShapes.indexOf(shape.unlockInfo.lockedId) < 0) {
            locked = true;
            unlockCost = shape.unlockInfo.unlockXPCost;
            if (userXP >= unlockCost) {
              lockedOverlay = "<div class=\"svga-element-locked-unlockable-overlay\"><svg viewBox=\"64 64 896 896\" focusable=\"false\" class=\"svga-element-locked-icon\" data-icon=\"unlock\" fill=\"green\" aria-hidden=\"true\"><path d=\"M832 464H332V240c0-30.9 25.1-56 56-56h248c30.9 0 56 25.1 56 56v68c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-68c0-70.7-57.3-128-128-128H388c-70.7 0-128 57.3-128 128v224h-68c-17.7 0-32 14.3-32 32v384c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V496c0-17.7-14.3-32-32-32zm-40 376H232V536h560v304zM484 701v53c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8v-53a48.01 48.01 0 10-56 0z\"></path></svg></div>";
            } else {
              lockedOverlay = "<div class=\"svga-element-locked-overlay\"><svg viewBox=\"64 64 896 896\" focusable=\"false\" class=\"svga-element-locked-icon\" data-icon=\"lock\" fill=\"black\" aria-hidden=\"true\"><path d=\"M832 464h-68V240c0-70.7-57.3-128-128-128H388c-70.7 0-128 57.3-128 128v224h-68c-17.7 0-32 14.3-32 32v384c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V496c0-17.7-14.3-32-32-32zM332 240c0-30.9 25.1-56 56-56h248c30.9 0 56 25.1 56 56v224H332V240zm460 600H232V536h560v304zM484 701v53c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8v-53a48.01 48.01 0 10-56 0z\"></path></svg></div>";
            }
          }
        }
        a("#svga-elements-" + bodyZone).show()
        a("#svga-colors-" + bodyZone).show()
        /*
        a("#svga-elements-" + bodyZone).append(
          '<div class="svga-elements"' +
          'id="svga-elements-' + bodyZone + "-" + i +
          '" data-zone="' + bodyZone +
          '" data-shape="' + i +
          '" data-locked="' + locked +
          '" data-unlockcost="' + unlockCost +
          '">' + lockedOverlay + '</div>'
        )
         */
    /*
        let svgElement = b("svga-elements-" + bodyZone + "-" + i)
          .size("100%", "100%")
          .attr({
            id: "svga-svgcanvas-elements-" + bodyZone + "-" + i,
            width: null,
            height: null,
            class: "svga-svg",
            viewBox: "0 0 200 200",
            preserveAspectRatio: "xMinYMin meet"
          })
          .group()
          .attr({
            id: "svga-svgcanvas-elements-" + bodyZone + "-" + i + "-g"
          })
        var shapeIndex = i
        for (segmentOfShape in bodyZoneConfig[bodyZone].shapes[shapeIndex]) {
          if (!bodyZoneConfig[bodyZone].shapes[shapeIndex].hasOwnProperty(segmentOfShape)) continue;
          if ("right" !== segmentOfShape &&
            "single" !== segmentOfShape &&
            "back" !== segmentOfShape &&
            "front" !== segmentOfShape) continue;

          if (bodyZoneConfig[bodyZone].shapes[shapeIndex][segmentOfShape].length) {
            drawBodyPartOnCanvas(bodyZone, shapeIndex, segmentOfShape, onCanvas)
            K = svgElement.bbox()
            svgElement
              .transform({ scale: bodyZoneScaleFactor })
              .transform({ x: -K.x * bodyZoneScaleFactor + (200 - K.width * bodyZoneScaleFactor) / 2 })
              .transform({ y: -K.y * bodyZoneScaleFactor + (200 - K.height * bodyZoneScaleFactor) / 2 })
            if ("clothes" === bodyZone) {
              svgElement.move(10, 5)
            }
            if ("hair" === bodyZone && 0 < shapeIndex) {
              svgElement.move(0, 20)
            }
          } else {
            a("#svga-elements-" + bodyZone + "-" + i)
              .empty()
              .append("<div></div>")
              .addClass("empty")
          }
        }
      }
      a("#svga-elements-" + bodyZone).hide()
      /*a("#svga-colors").append(
        '<div id="svga-colors-' + bodyZone + '" class="svga-colors-set"></div>'
      )
      for (let i = 0; i < bodyZoneColors.length; i++)
        a("#svga-colors-" + bodyZone).append("<div></div>"),
          a("#svga-colors-" + bodyZone + " div:last-child").css(
            "background-color",
            bodyZoneColors[i]
          )
       */
    /*
      a("#svga-colors-" + bodyZone).hide()
    }*/

    a("#svga-custom-color").hide()
    /*for (let i = shapeIndex = 0; i < bodyZones.length; i++) {
      if ("backs" === bodyZones[i] || "hair" === bodyZones[i]) shapeIndex = 1
      for (segmentOfShape in bodyZoneConfig[bodyZones[i]].shapes[shapeIndex]) {
        let bodyZone, blocks
        if (bodyZoneConfig[bodyZones[i]].shapes[shapeIndex].hasOwnProperty(segmentOfShape)) {
          bodyZone = "svga-group-" + bodyZones[i] + "-" + segmentOfShape
          a("#" + bodyZone).empty()
          blocks = b.get(bodyZone)
          onCanvas = true
          drawBodyPartOnCanvas(blocks, bodyZones[i], shapeIndex, segmentOfShape, onCanvas)
        }
      }
      selectedAvatarElements[bodyZones[i]] = shapeIndex
      shapeIndex = 0
    }*/
    a(".svga-colors-set > div").on("click", function() {
      //colorsSetFunction(a(this))
    })
    a("#svga-custom-color > input").spectrum({
      color: "#000000",
      clickoutFiresChange: !0,
      showInput: !0,
      showInitial: !0,
      showButtons: !1,
      move: L,
      change: L
    })
    a(".sp-replacer").on("click", function() {
      a("#svga-colors-" + activeBodyZone + " div.svga-active").removeClass("svga-active")
      
    })
    a(".svga-blocks").on("click", function() {
      var node = a(this),
        b = node.data("bodyzones").split(","),
        e = node.data("blockname")
      //node.siblings().removeClass("svga-active")
      //node.addClass("svga-active")
      //a("#svga-bodyzones")
      //  .children()
      //  .hide()
      //for (node = 0; node < b.length; node++) a("#svga-bodyzones-" + b[node]).show()
      //a("#svga-bodyzones")
      //  .children()
      //  .removeClass("svga-active")
      a("#svga-bodyzones-" + blocksNamesMapping[e])
      //  .addClass("svga-active")
        .trigger("click")
    })
    a(".svga-bodyzones").on("click", function() {
      var g = a(this)
      activeBodyZone = g.data("bodyzone")
      var b = g.data("block"),
        f = g.data("controls").split(",")
      //g.siblings().removeClass("svga-active")
      //g.addClass("svga-active")
      a("#svga-elements")
        .children()
        .hide()
      a("#svga-elements-" + activeBodyZone).show()
      a("#svga-colors")
        .children()
        .hide()
      a("#svga-custom-color").hide()
      bodyZoneConfig[activeBodyZone].colors &&
      (a("#svga-colors-" + activeBodyZone).show(), a("#svga-custom-color").show())
      a("#svga-controls")
        .children()
        .hide()
      for (g = 0; g < f.length; g++)
        a("#svga-controls-" + f[g]).css("display", "inline-block")
      blocksNamesMapping[b] = activeBodyZone
      
      a("#svga-elements-" + activeBodyZone + "-" + selectedAvatarElements[activeBodyZone])
        .addClass("svga-active-element")
        .trigger("click")
    })
    a(".svga-elements").on("click", function() {
      /*const jQuerySelector = a(this);
      const jQuerySelectorData = jQuerySelector.data();
      let bodyZone = jQuerySelectorData.zone

      if (jQuerySelectorData.locked) {
        if (onClickLockedShape(jQuerySelectorData.unlockcost, jQuerySelectorData.zone, jQuerySelectorData.shape)) {
          jQuerySelector.find(".svga-element-locked-unlockable-overlay").remove();
        }
        return;
      }

      bodyZone =
        "eyesfront" === bodyZone
          ? ["eyesback", "eyesfront"]
          : "faceshape" === bodyZone
          ? ["faceshape", "chinshadow"]
          : bodyZone.split()
      for (var i = 0; i < bodyZone.length; i++) {
        a("#svga-custom-color > input").spectrum("set", bodyPartColorMappings[bodyZone[i]])
        //shapeIndex = "facehighlight" === bodyZone[i] || "humanbody" === bodyZone[i] ? 0 : jQuerySelectorData.shape
        shapeIndex = jQuerySelectorData.shape
        for (segmentOfShape in bodyZoneConfig[bodyZone[i]].shapes[shapeIndex])
          if (bodyZoneConfig[bodyZone[i]].shapes[shapeIndex].hasOwnProperty(segmentOfShape)) {
            a("#svga-group-" + bodyZone[i] + "-" + segmentOfShape).empty()
            onCanvas = true
            drawBodyPartOnCanvas(b.get("svga-group-" + bodyZone[i] + "-" + segmentOfShape), bodyZone[i], shapeIndex, segmentOfShape, onCanvas)
          }
        jQuerySelector.siblings().removeClass("svga-active-element")
        jQuerySelector.addClass("svga-active-element")
        selectedAvatarElements[bodyZone[i]] = shapeIndex
      }*/
      
    })
    a(".svga-glob-controls").on("click", function() {
      var g = a(this).attr("id"),
        e = b.get("svga-group-humanwrap-move")
      switch (g) {
        case "svga-glob-controls-up":
          e.svgaUp(3, 2)
          break
        case "svga-glob-controls-down":
          e.svgaDown(3, 2)
          break
        case "svga-glob-controls-left":
          e.svgaLeft(4, 2)
          break
        case "svga-glob-controls-right":
          e.svgaRight(4, 2)
          break
        case "svga-glob-controls-scaleup":
          b.get("svga-group-humanwrap").svgaScaleUp()
          break
        case "svga-glob-controls-scaledown":
          b.get("svga-group-humanwrap").svgaScaleDown()
          break
        case "svga-glob-controls-tiltleft":
          b.get("svga-group-hair-back-move").svgaRotateLeft(1, 3, 100, 150)
          b.get("svga-group-head").svgaRotateLeft(1, 3, 100, 150)
          break
        case "svga-glob-controls-tiltright":
          b.get("svga-group-hair-back-move").svgaRotateRight(1, 3, 100, 150),
            b.get("svga-group-head").svgaRotateRight(1, 3, 100, 150)
      }
      
    })
    a("#svga-controls-up").on("click", function() {
      switch (activeBodyZone) {
        case "mouth":
          var a = b.get("svga-group-mouth-single-move")
          a.svgaUp()
          break
        case "ears":
          a = b.get("svga-group-ears-left-move")
          a.svgaUp(1)
          a = b.get("svga-group-ears-right-move")
          a.svgaUp(1)
          break
        case "nose":
          a = b.get("svga-group-nose-single-move")
          a.svgaUp(4)
          break
        case "eyebrows":
          a = b.get("svga-group-eyebrows-left-move")
          a.svgaUp(4)
          a = b.get("svga-group-eyebrows-right-move")
          a.svgaUp(4)
          break
        case "eyesfront":
          a = b.get("svga-group-eyes-left-move")
          a.svgaUp(2)
          a = b.get("svga-group-eyes-right-move")
          a.svgaUp(2)
          break
        case "eyesiris":
          a = b.get("svga-group-eyesiriscontrol-left")
          a.svgaUp()
          a = b.get("svga-group-eyesiriscontrol-right")
          a.svgaUp()
          break
        case "mustache":
          a = b.get("svga-group-mustache-single-move")
          a.svgaUp(4)
          break
        case "beard":
          a = b.get("svga-group-beard-single-move")
          a.svgaUp(4)
          break
        case "glasses":
          ;(a = b.get("svga-group-glasses-single-move")), a.svgaUp(5)
      }
      
    })
    a("#svga-controls-down").on("click", function() {
      switch (activeBodyZone) {
        case "mouth":
          var a = b.get("svga-group-mouth-single-move")
          a.svgaDown()
          break
        case "ears":
          a = b.get("svga-group-ears-left-move")
          a.svgaDown(1)
          a = b.get("svga-group-ears-right-move")
          a.svgaDown(1)
          break
        case "nose":
          a = b.get("svga-group-nose-single-move")
          a.svgaDown(4)
          break
        case "eyebrows":
          a = b.get("svga-group-eyebrows-left-move")
          a.svgaDown(4)
          a = b.get("svga-group-eyebrows-right-move")
          a.svgaDown(4)
          break
        case "eyesfront":
          a = b.get("svga-group-eyes-left-move")
          a.svgaDown(2)
          a = b.get("svga-group-eyes-right-move")
          a.svgaDown(2)
          break
        case "eyesiris":
          a = b.get("svga-group-eyesiriscontrol-left")
          a.svgaDown()
          a = b.get("svga-group-eyesiriscontrol-right")
          a.svgaDown()
          break
        case "mustache":
          a = b.get("svga-group-mustache-single-move")
          a.svgaDown(4)
          break
        case "beard":
          a = b.get("svga-group-beard-single-move")
          a.svgaDown(4)
          break
        case "glasses":
          ;(a = b.get("svga-group-glasses-single-move")), a.svgaDown(5)
      }
      
    })
    a("#svga-controls-left").on("click", function() {
      switch (activeBodyZone) {
        case "mouth":
          var a = b.get("svga-group-mouth-single-move")
          a.svgaLeft(2, 0.5)
          break
        case "nose":
          a = b.get("svga-group-nose-single-move")
          a.svgaLeft(2, 0.5)
          break
        case "eyesiris":
          a = b.get("svga-group-eyesiriscontrol-left")
          a.svgaLeft()
          a = b.get("svga-group-eyesiriscontrol-right")
          a.svgaLeft()
          break
        case "mustache":
          a = b.get("svga-group-mustache-single-move")
          a.svgaLeft(2, 0.5)
          break
        case "beard":
          ;(a = b.get("svga-group-beard-single-move")), a.svgaLeft(2, 0.5)
      }
      
    })
    a("#svga-controls-right").on("click", function() {
      switch (activeBodyZone) {
        case "mouth":
          var a = b.get("svga-group-mouth-single-move")
          a.svgaRight(2, 0.5)
          break
        case "nose":
          a = b.get("svga-group-nose-single-move")
          a.svgaRight(2, 0.5)
          break
        case "eyesiris":
          a = b.get("svga-group-eyesiriscontrol-left")
          a.svgaRight()
          a = b.get("svga-group-eyesiriscontrol-right")
          a.svgaRight()
          break
        case "mustache":
          a = b.get("svga-group-mustache-single-move")
          a.svgaRight(2, 0.5)
          break
        case "beard":
          ;(a = b.get("svga-group-beard-single-move")), a.svgaRight(2, 0.5)
      }
      
    })
    a("#svga-controls-scaleup").on("click", function() {
      switch (activeBodyZone) {
        case "faceshape":
          var a = b.get("svga-group-faceshape-wrap")
          a.svgaScaleUp(2, 0.02, 1e-4)
          a = b.get("svga-group-hair-back")
          a.svgaScaleUp(2, 0.02, 1e-4)
          a = b.get("svga-group-hair-front")
          a.svgaScaleUp(2, 0.02, 1e-4)
          a = b.get("svga-group-beardwrap")
          a.svgaScaleUp(2, 0.02, 1e-4)
          a = b.get("svga-group-ears-left-move")
          a.svgaLeft(2, 1.5)
          a = b.get("svga-group-ears-right-move")
          a.svgaRight(2, 1.5)
          break
        case "mouth":
          a = b.get("svga-group-mouth-single")
          a.svgaScaleUp(7)
          break
        case "nose":
          a = b.get("svga-group-nose-single")
          a.svgaScaleUp(5)
          break
        case "ears":
          a = b.get("svga-group-ears-left")
          a.svgaScaleUp(1)
          a = b.get("svga-group-ears-right")
          a.svgaScaleUp(1)
          break
        case "eyebrows":
          a = b.get("svga-group-eyebrows-left")
          a.svgaScaleUp()
          a = b.get("svga-group-eyebrows-right")
          a.svgaScaleUp()
          break
        case "eyesfront":
          a = b.get("svga-group-eyes-left")
          a.svgaScaleUp(2)
          a = b.get("svga-group-eyes-right")
          a.svgaScaleUp(2)
          break
        case "eyesiris":
          a = b.get("svga-group-eyesiris-left")
          a.svgaScaleUp(4)
          a = b.get("svga-group-eyesiris-right")
          a.svgaScaleUp(4)
          break
        case "mustache":
          a = b.get("svga-group-mustache-single")
          a.svgaScaleUp(4)
          break
        case "beard":
          a = b.get("svga-group-beard-single")
          a.svgaScaleUp(3)
          break
        case "glasses":
          ;(a = b.get("svga-group-glasses-single")), a.svgaScaleUp(3)
      }
      
    })
    a("#svga-controls-scaledown").on("click", function() {
      switch (activeBodyZone) {
        case "faceshape":
          var a = b.get("svga-group-faceshape-wrap")
          a.svgaScaleDown(2, 0.02, 1e-4)
          a = b.get("svga-group-hair-back")
          a.svgaScaleDown(2, 0.02, 1e-4)
          a = b.get("svga-group-hair-front")
          a.svgaScaleDown(2, 0.02, 1e-4)
          a = b.get("svga-group-beardwrap")
          a.svgaScaleDown(2, 0.02, 1e-4)
          a = b.get("svga-group-ears-left-move")
          a.svgaRight(2, 1.5)
          a = b.get("svga-group-ears-right-move")
          a.svgaLeft(2, 1.5)
          break
        case "mouth":
          a = b.get("svga-group-mouth-single")
          a.svgaScaleDown(7)
          break
        case "nose":
          a = b.get("svga-group-nose-single")
          a.svgaScaleDown(5)
          break
        case "ears":
          a = b.get("svga-group-ears-left")
          a.svgaScaleDown(1)
          a = b.get("svga-group-ears-right")
          a.svgaScaleDown(1)
          break
        case "eyebrows":
          a = b.get("svga-group-eyebrows-left")
          a.svgaScaleDown(2)
          a = b.get("svga-group-eyebrows-right")
          a.svgaScaleDown(2)
          break
        case "eyesfront":
          a = b.get("svga-group-eyes-left")
          a.svgaScaleDown(2)
          a = b.get("svga-group-eyes-right")
          a.svgaScaleDown(2)
          break
        case "eyesiris":
          a = b.get("svga-group-eyesiris-left")
          a.svgaScaleDown(4)
          a = b.get("svga-group-eyesiris-right")
          a.svgaScaleDown(4)
          break
        case "mustache":
          a = b.get("svga-group-mustache-single")
          a.svgaScaleDown(4)
          break
        case "beard":
          a = b.get("svga-group-beard-single")
          a.svgaScaleDown(3)
          break
        case "glasses":
          ;(a = b.get("svga-group-glasses-single")), a.svgaScaleDown(3)
      }
      
    })
    a("#svga-controls-tightly").on("click", function() {
      switch (activeBodyZone) {
        case "eyebrows":
          var a = b.get("svga-group-eyebrows-left-move")
          a.svgaRight()
          a = b.get("svga-group-eyebrows-right-move")
          a.svgaLeft()
          break
        case "eyesfront":
          ;(a = b.get("svga-group-eyes-left-move")),
          a.svgaRight(),
          (a = b.get("svga-group-eyes-right-move")),
          a.svgaLeft()
      }
      
    })
    a("#svga-controls-wider").on("click", function() {
      switch (activeBodyZone) {
        case "eyebrows":
          var a = b.get("svga-group-eyebrows-left-move")
          a.svgaLeft()
          a = b.get("svga-group-eyebrows-right-move")
          a.svgaRight()
          break
        case "eyesfront":
          ;(a = b.get("svga-group-eyes-left-move")),
          a.svgaLeft(),
          (a = b.get("svga-group-eyes-right-move")),
          a.svgaRight()
      }
      
    })
    a("#svga-controls-eb1").on("click", function() {
      var a = b.get("svga-group-eyebrows-left-rotate")
      a.svgaCancelRotate().svgaRotateRight(1, C / 2)
      a = b.get("svga-group-eyebrows-right-rotate")
      a.svgaCancelRotate().svgaRotateRight(1, C / 4)
      
    })
    a("#svga-controls-eb2").on("click", function() {
      var a = b.get("svga-group-eyebrows-left-rotate")
      a.svgaCancelRotate().svgaRotateLeft(1, C / 4)
      a = b.get("svga-group-eyebrows-right-rotate")
      a.svgaCancelRotate().svgaRotateLeft(1, C / 2)
      
    })
    a("#svga-controls-eb3").on("click", function() {
      var a = b.get("svga-group-eyebrows-left-rotate")
      a.svgaCancelRotate().svgaRotateRight(1, C / 2)
      a = b.get("svga-group-eyebrows-right-rotate")
      a.svgaCancelRotate().svgaRotateLeft(1, C / 2)
      
    })
    a("#svga-controls-eb4").on("click", function() {
      var a = b.get("svga-group-eyebrows-left-rotate")
      a.svgaCancelRotate().svgaRotateLeft(1, C / 1.4)
      a = b.get("svga-group-eyebrows-right-rotate")
      a.svgaCancelRotate().svgaRotateRight(1, C / 1.4)
      
    })
    a("#svga-controls-ebcancel").on("click", function() {
      var a = b.get("svga-group-eyebrows-left-rotate")
      a.svgaCancelRotate()
      a = b.get("svga-group-eyebrows-right-rotate")
      a.svgaCancelRotate()
    })
    a("#svga-resetavatar").on("click", function() {
      U = "reset"
    })
    a("#svga-randomavatar").on("click", function() {
      U = "random"
    })
    a("#svga-dialog-ok").on("click", function() {
      /*"reset" === U
        ? (resetAvatar() && resetFunction())
        : "random" === U && randomAvatar()*/
    })
    a("#svga-tryagain").on("click", function() {
      a("#svga-loader").hide()
      a("#svga-message").hide()
      a("#svga-ios").hide()
    })

    a("#svga-saveavatar").on("click", function() {
      //a("#svga-work-overlay").fadeIn("fast")
      //q && q.hide()
      //r && r.hide()
      var b = a("#svga-svgmain").html()
      /*saveFunction(b, selectedAvatarElements, colors, function() {
        a("#svga-message-text").removeClass("svga-error")
        a("#svga-work-overlay").fadeOut("fast")
      })*/
    })
    a(".svga-col-left .sp-dd").remove()
    a("#svga-blocks-face").trigger("click")
    a("#svga-bodyzones-faceshape").trigger("click")
    a("#svga-elements-faceshape-" + selectedAvatarElements.faceshape)
      .trigger("click")
      .addClass("svga-active-element")
    //a("#svga-colors-faceshape > div:nth-child(1)").trigger("click")
    a("#svga-loader").hide()
    setTimeout(function() {
      da()
    }, 100)
    a("#svga-start-overlay").hide()
  }
  function da() {
    /*var b = a(".svga-col-left"),
      e = a(".svga-col-right")
    b.height("auto")
    e.height("auto")
    if (481 <= window.innerWidth) {
      var c = b.height(),
        f = e.height()
      c >= f ? e.height(c) : b.height(f)
    }*/
  }
  var c = svgAvatarsOptions(),
    b = SVG,
    Q = window.tinycolor,
    G = window.canvg
  c.version = "1.4"
  var f = svgAvatarsTranslation()
  c.pathToFolder.match(/(\/)$/) ||
    "" === c.pathToFolder.trim() ||
    (c.pathToFolder += "/")
  b.extend(b.Element, {
    svgaCenterScale: function(a, b) {
      var e = this.bbox(),
        c = e.cx
      e = e.cy
      b || (b = a)
      return this.transform({
        a: a,
        b: 0,
        c: 0,
        d: b,
        e: c - a * c,
        f: e - b * e
      })
    },
    svgaLeft: function(a, b) {
      a = a ? a : 3
      b = b ? b : N
      var e = this.data("leftright"),
        c = this.data("updown")
      e > -(a * b) && (this.move(e - b, c), this.data("leftright", e - b))
      return this
    },
    svgaRight: function(a, b) {
      a = a ? a : 3
      b = b ? b : N
      var e = this.data("leftright"),
        c = this.data("updown")
      e < a * b && (this.move(e + b, c), this.data("leftright", e + b))
      return this
    },
    svgaUp: function(a, b) {
      a = a ? a : 3
      b = b ? b : V
      var e = this.data("leftright"),
        c = this.data("updown")
      c > -(a * b) && (this.move(e, c - b), this.data("updown", c - b))
      return this
    },
    svgaDown: function(a, b) {
      a = a ? a : 3
      b = b ? b : V
      var e = this.data("leftright"),
        c = this.data("updown")
      c < a * b && (this.move(e, c + b), this.data("updown", c + b))
      return this
    },
    svgaScaleUp: function(a, b, c) {
      a = a ? a : 3
      b = b ? b : W
      c = c ? c : b
      var e = this.data("scaleX") + 1e-7,
        f = this.data("scaleY") + 1e-7
      e < 1 + a * b &&
        (this.svgaCenterScale(e + b, f + c),
        this.data("scaleX", e + b + 1e-7),
        this.data("scaleY", f + c + 1e-7))
      return this
    },
    svgaScaleDown: function(a, b, c) {
      a = a ? a : 3
      b = b ? b : W
      c = c ? c : b
      var e = this.data("scaleX") - 1e-7,
        f = this.data("scaleY") - 1e-7
      e > 1 - a * b &&
        (this.svgaCenterScale(e - b, f - c),
        this.data("scaleX", e - b - 1e-7),
        this.data("scaleY", f - c - 1e-7))
      return this
    },
    svgaRotateLeft: function(a, b, c, f) {
      a = a ? a : 2
      b = b ? b : C
      var e = this.data("rotate")
      e > -(a * b) &&
        (this.rotate(e - b - 1e-7, c, f), this.data("rotate", e - b))
      return this
    },
    svgaRotateRight: function(a, b, c, f) {
      a = a ? a : 2
      b = b ? b : C
      var e = this.data("rotate")
      e < a * b && (this.rotate(e + b + 1e-7, c, f), this.data("rotate", e + b))
      return this
    },
    svgaCancelRotate: function() {
      return this.rotate(1e-7).data("rotate", 1e-7, !0)
    }
  })
  var ba = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? !0 : !1,
    ea = navigator.userAgent.match(/(Android)/g) ? !0 : !1,
    fa = navigator.userAgent.match(/(Opera)/g) ? !0 : !1,
    ca =
      -1 !== navigator.platform.toLowerCase().indexOf("win") &&
      -1 !== navigator.userAgent.toLowerCase().indexOf("touch")
        ? !0
        : !1,
    V = 1,
    N = 1,
    W = 0.05,
    C = 15
  switch (c.colorScheme) {
    case "light":
      a("#svga-container").addClass("svga-light")
      break
    case "dark":
      a("#svga-container").addClass("svga-dark")
      break
    case "custom":
      a("#svga-container").addClass("svga-custom")
      break
    default:
      a("#svga-container").addClass("svga-light")
  }
  b.supported &&
    (a("#svga-canvas").attr({ width: 200, height: 200 }),
    ba &&
      (a("#svga-container").removeClass("svga-no-touch"),
      a("#svga-downloadavatar > ul").remove()),
    ea && c.hideSvgDownloadOnAndroid && a("#svga-svgfile").remove(),
    fa && a("#svga-container").addClass("svga-opera"),
    ca &&
      (a("#svga-container").addClass("svga-win8tablet"),
      a("#svga-downloadavatar > ul").remove()),
    a(window).on("resize orientationchange", function() {
      da()
    }),
    a(".scrollbar").scrollbar({ showArrows: !1, ignoreMobile: !1 }))

  function applyInitialState(initialBody, initialColors) {

    //for (var bodyPart in initialBody) {
      //a("#svga-elements-" + bodyPart + "-" + initialBody[bodyPart]).trigger("click")
      /*if (initialColors) {
        a("#svga-blocks-" + (bodyPart === "backs" ? "backs"
          : (bodyPart === "beard" || bodyPart === "chinshadow" || bodyPart === "facehighlight" || bodyPart === "mustache" || bodyPart === "mouth" || bodyPart === "nose" || bodyPart === "ears") ? "face"
            : bodyPart === "hair" ? "hair"
              : (bodyPart === "eyesfront" || bodyPart === "eyesback" || bodyPart === "eyesiris" || bodyPart === "eyebrows" || bodyPart === "glasses") ? "eyes"
                : "clothes")
        ).trigger("click")
        a("#svga-bodyzones-" + bodyPart).trigger("click")
        a("#svga-colors-" + bodyPart + " > div:nth-child(" + initialColors[bodyPart] + ")").trigger("click")
      }*/
    //}
    //a("#svga-blocks-face").trigger("click")
    //a("#svga-bodyzones-faceshape").trigger("click")
  }
}
