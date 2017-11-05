using System;
using System.Collections.Generic;
using System.Web.Mvc;
using ddk.Tzemah.WebNew.Models;
//using DDK.Inf.Log;
using Geoview.Tzemah.Common;
using Geoview.Tzemah.Common.LabData;
using Microsoft.Ajax.Utilities;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace ddk.Tzemah.WebNew.Controllers
{
    //[Log]
    public class MagikImportController : Controller
    {
        [Authorize]
        public ActionResult Index()
        {
            return View();
        }
        [Authorize]
        [HttpPost]
        public string Index(LabDataFileParseRequestModel parseRequest)
        {
            //the user object now has the form fields from the view. 


            List<LabDataModel> result = new List<LabDataModel>();
            try
            {
                Importer importer = new Importer(parseRequest.ColumnsToLabelsTranslation);
                result = importer.Import(parseRequest.MagikFileData, parseRequest.PitIds, parseRequest.SurveyId);
            }
            catch (Exception e)
            {
                //Logger.LogMessage(LogInfo.Error, "could not parse a  file\n"+e);
                return JsonConvert.SerializeObject(new { result, status = "BAD" }, new IsoDateTimeConverter());
            }
            return JsonConvert.SerializeObject(new { result, status = "OK" }, new IsoDateTimeConverter());
            return "";
        }
    }
}