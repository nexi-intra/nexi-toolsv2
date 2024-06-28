
import moment from "moment";

import negativeSmiley from "./negative.jpg"
import { useEffect, useState } from "react";
import { set } from "date-fns";
import { Button } from "@/components/ui/button";
/* global Button, Header, HeroList, HeroListItem, Progress */
const DEBUGGING = false;
const CAVAURL = "https://cava.nets-intranets.com?id="
const POWERAPPURL = "https://apps.powerapps.com/play/b1d61da1-e71d-4067-9e5e-36063dd875fb?tenantId=79dc228f-c8f2-4016-8bf0-b990b6c72e98?id=";



function get(property : any) : Promise<any> {
  return new Promise((resolve, reject) => {
    property.getAsync((result : any) => {
      if (result.status !== Office.AsyncResultStatus.Succeeded) {
        return resolve("");
      }
      return resolve(result.value);
    });
  });
}

function getCateringProviderInfo(location :any){
return new Promise(async (resolve, reject) => {
  if (!location){
    return resolve(null)
  }

  var response = await fetch("https://netszbar.blob.core.windows.net/zbar/cava.outlook.json")
  var locations : {Title:string}[]= await response.json()
  
  resolve(locations.find(l => l.Title === location))
});


}

function getLocation() {
  return get(Office.context.mailbox.item?.location);
}

function getItem() {
  return get(Office.context.mailbox.item);
}

function getStart() {
  return get(Office.context.mailbox.item?.start);
}

function getEnd() {
  return get(Office.context.mailbox.item?.end);
}

function getOrganizer() {
  return get(Office.context.mailbox.item?.organizer);
}

function isRecurring() {
  return new Promise((resolve, reject) => {
    Office.context.mailbox.item?.recurrence.getAsync(function(asyncResult) {
      if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
        var recurrence = asyncResult.value;
        if (recurrence === null) {
          resolve(false);
          //console.log("This is a single appointment.");
        } else {
          resolve(true);
          //console.log(`Recurrence pattern: ${JSON.stringify(recurrence)}`);
        }
      } else {
        resolve(false);
        console.error(asyncResult.error);
      }
    });
  });
}
function getBody() : Promise<string> {
  return new Promise((resolve, reject) => {
    Office.context.mailbox.item?.body.getAsync(Office.CoercionType.Html, function(asyncResult) {
      if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
        resolve(asyncResult.value);
      } else {
        resolve("");
      }
    });
  });
}

function insertcavaLink(id : string) {
  return new Promise((resolve, reject) => {
    try {

      var html = "<div style='color:#005776'> <hr/><h2>CAVA - Nets Meeting Services</h2>";
      html +=
        "This is a link used by the organizer of the meeting to order additional services<br/><br/><a " +
        "href='" +
        CAVAURL +
        id +
        "' target='_blank'>Open CAVA</a><br/>" +
        //"<div style='color:#ffffff'>#CAVAIDSTART#"+_.replace(id,"@","-") +"#CAVAIDEND#</div>"+
        "<hr/></div>";

      Office.context.mailbox.item?.setSelectedDataAsync(
        html,
        {
          coercionType: Office.CoercionType.Html
        },
        function(asyncResult) {
          if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
            resolve("Selected text has been updated successfully.");
          } else {
            reject(asyncResult.error);
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}
export default function CavaPanel (props : { title : string, isOfficeInitialized : boolean }) {
  const [isConnected, setisConnected] = useState(false)
  const [location, setlocation] = useState("")
  const [recurring, setrecurring] = useState(false)
  const [cateringProviderInfo, setcateringProviderInfo] = useState<any>(null)
  const [existingID, setexistingID] = useState("")
  const [cavaLink, setcavaLink] = useState("")
  const [powerAppLink, setpowerAppLink] = useState("")
  const [id, setid] = useState("")
  const [page, setpage] = useState("")


  // constructor(props, context) {
  //   super(props, context);
  //   var search =  ""// getSearchParametersFromHRef(window.location.search);
  //   this.state = {
  //     listItems: [
  //       { primaryText: "Only one location", icon: "" },
  //       { primaryText: "No recurrence", icon: "" }
  //     ],
  //     page: search.page,
  //     logs: ["Log"],
  //     isConnected: false,
  //     id: Date.now(),
  //     insertedLinkRun : false
  //   };
  // }
  
  // https://netszbar.blob.core.windows.net/zbar/cava.outlook.json
useEffect(() => {
  const load = async (existingID : string) => {
    //   console.log("doload");

    var body = await getBody().catch(error => {
      console.log("ERROR doLoad getBody : " + error);
    });
    if (body && body.indexOf(CAVAURL) > -1) {
      setisConnected(true);
  
    }

    var organizer = await getOrganizer();

    var stateid : string = existingID ? existingID : organizer.emailAddress + ":" +id;

    var start = await getStart();
    var end = await getEnd();
    var location = await getLocation();

    var additionalProps = "&start=" + moment(start).toISOString();
    additionalProps += "&end=" + moment(end).toISOString();
    additionalProps += "&location=" + location;

    var cavaLink = CAVAURL + stateid + additionalProps;
    var powerAppLink = POWERAPPURL + stateid + additionalProps;

    // this.setState({ cavaLink,powerAppLink,remyId: id,additionalProps });
    //console.log("start raw" + start);

    //console.log("start moment " + moment(start).toISOString());
  };

  const checkLocation = async () => {
    try {
      var location = await getLocation().catch(e => {});
      var body = await getBody();
      if (body.indexOf(CAVAURL) > -1) {
        var s = body.split(CAVAURL);
        var s2 = s[1].split('"');
        var id = s2[0];

        // if (existingID !== id) {
        //   this.setState({ existingID: id });
        //   this.doLoad(id)
        // }

        console.log(id);
      } else {
        // if (existingID) {
        //   this.setState({ existingID: "" });
        //   this.doLoad()
        // }else
        // {
        //   if (existingID)  return
        //   //if (remyId) insertcavaLink(remyId)

        // }
      }
      var recurring = await isRecurring();
     console.log("Checking location " + location);
     console.log("Recurring " + recurring);

      var cateringProviderInfo = await getCateringProviderInfo(location)
      //this.setState({ cateringProviderInfo });

      // if (location && !insertedLinkRun && !existingID){
      //   var organizer = await getOrganizer();
      //   if (organizer){
      //   var id = organizer.emailAddress + ":" + id;
      //   insertcavaLink(id)
      // }
        
      // }
      // this.setState({ location, recurring });
    } catch (error) {}

    //setTimeout(this.checkLocation, 500);
  };
  load("")
  
}, [])



  // click = async () => {
  //   try {
  //     var organizer = await getOrganizer();
  //     var timestamp = Date.now();
  //     var id = existingID ? existingID : organizer.emailAddress + ":" + timestamp;

  //     var body = await getBody().catch(error => {
  //      console.log("ERROR reading body: " + error);
  //     });

  //     if (!existingID) {
  //       var insertStatus = await insertcavaLink(id).catch(error => {
  //        console.log("ERROR insertcavaLink: " + error);
  //       });
  //       if (insertStatus) this.setState({ isConnected: true });
  //     } else {
  //       this.setState({ isConnected: true });
  //      console.log("Already linked");
  //     }
  //   } catch (error) {
  //    console.log("ERROR general: " + error.message);
  //   }
  // };



    const { title, isOfficeInitialized } = props;





var orderLink = "" //( cateringProviderInfo ? cateringProviderInfo.PriceList : "") + "?room=58" + additionalProps
    return (
      <div className="ms-welcome">
        {false && location && !recurring && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
          
            <iframe style={{border:"0px" ,width:"90vw",height:"90vh"}} src={powerAppLink + "&page=" + page}></iframe>
            <a href={powerAppLink + "&page=" + page} target="_blank">
            <Button
            style={{right:"10px", bottom:"10px",position: "fixed"}}
            onClick={() => {
              
              // if (existingID)  return
              // insertcavaLink(remyId)
            }}
            
            
          >
            Open in Browser
          </Button>
          </a>

          </div>
        )}

        
          <div>
            
<div style={{textAlign:"right",paddingRight:20}}>In preview</div>
            <div style={{ padding: "20px" }}>
            <h3>1. Add a Meeting Room</h3>              
            {!cateringProviderInfo && <div>
              
              <p>
                
                Add a <b>Meeting Room</b> to the <b>Location</b> field in the appointment 
                </p>
                
                 <a href="https://christianiabpos.sharepoint.com/sites/cava2/SitePages/How-to-book-meeting-rooms.aspx" target="_blank">How to find a Meeting Room?</a>
                <p>
                <i>You have to add one location to your meeting so we know which service provider should help you.</i>
              </p>
              </div>}
              {cateringProviderInfo && !cateringProviderInfo.PriceList &&
<div>
  <p style={{textAlign:"center"}}>
  <img style={{width:"60vw"}} src=""></img> </p>
  Room <b>{cateringProviderInfo.Title}</b> with email address <b>{cateringProviderInfo.Email}</b> is not connected to any Catering Provider

  
  </div>}              
{cateringProviderInfo && cateringProviderInfo.PriceList &&
<div>
              <h3>2. Connect with CAVA</h3>              
              {!existingID && <div>
              <p>
Click in the <b>body of your appointment</b>, that will make a link appear which is used for automatically change the delivery time of your order and make it possible for you to make changes to your order.

              </p>
              <p>
You can use the CAVA link to change / view your order from any client - Teams, Mobile, Web, Desktop. The link cannot be used by other that you.

              </p>
              </div>}
              {existingID && <div>
              <h3>3. Open the Order form</h3>              
              <p>Click on the button to open the Order Form. </p>

              <p>The Order Form will open in a new window.</p>

              
              <p>
                <a   href={ orderLink}
            target="_blank">
              <Button
            
            onClick={() => {
              
              // if (existingID)  return
              // insertcavaLink(remyId)
            }}
            
          
          >
            Open Order Form
          </Button>
          </a>

              </p>
              </div>}
              </div>}
</div>
<div style={{right:"10px", bottom:"10px",position: "fixed", backgroundColor:"#fcfdb6", padding:"10px", textAlign:"center"}}>
<p>
                If you have questions about this functionality visit the <a href="https://christianiabpos.sharepoint.com/sites/cava2/SitePages/Outlook-Integration.aspx" target="_blank">SharePoint FAQ</a> page
              </p>
              <p style={{fontWeight:700}}>Note that recurring appointments and multi location meetings is not supported</p>
            </div>
          </div>
        


        <div>
        </div>

        {false && existingID && (
        <div style={{ position: "fixed", left: "10px", bottom: "10px" }}>{existingID}:{page}</div>
        )}
      </div>
    );
  }

