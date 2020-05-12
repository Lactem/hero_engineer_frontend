import "jquery"
import "jquery.soap"
import axios from "axios"

export const createAvatar = () => {
  /*const $ = require("jquery")
  require("jquery.soap")
  $.soap({
    url: "http://services.doppelme.com/partnerservice.asmx?WSDL",
    method: "",

    data: {
      name: 'Remy Blom',
      msg: 'Hi!'
    },

    success: function (soapResponse: any) {
      console.log("response: ", soapResponse)
      // do stuff with soapResponse
      // if you want to have the response as JSON use soapResponse.toJSON();
      // or soapResponse.toString() to get XML string
      // or soapResponse.toXML() to get XML DOM
    },
    error: function (err: any) {
      console.log("err: ", err)
    }
  });*/

  // eslint-disable-next-line no-multi-str
  const xmls ='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"\
                            xmlns:web="http://api.doppelme.com">\
            <soapenv:Header/>\
            <soapenv:Body>\
            </soapenv:Body>\
          </soapenv:Envelope>';

  axios.post("http://services.doppelme.com/partnerservice.asmx?WSDL",
    xmls).then(res=>{
    console.log(res);
  }).catch(err=>{console.log(err)});
}
