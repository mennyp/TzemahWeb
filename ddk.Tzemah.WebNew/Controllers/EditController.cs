using System;
using System.Configuration;
using System.IO;
using System.Web.Helpers;
using System.Web.Mvc;
using ddk.Tzemah.WebNew.Models;


namespace ddk.Tzemah.WebNew.Controllers
{
    //[Log]
    [Authorize]
    public class EditController : Controller
    {
        private readonly string m_AttachBaseDir;



        public EditController()
        {
            m_AttachBaseDir = ConfigurationManager.AppSettings["attachmentBase"];

        }

        // GET: Edit
        public ActionResult Index()
        {
            @ViewBag.Title = "עריכה";
            return View();
        }
        [Authorize]
        public ActionResult DeleteAttachment(AttachRow attachRow)
        {
            try
            {
                string filePath = Path.Combine(m_AttachBaseDir, attachRow.AttachmentUrl);
                System.IO.File.Delete(filePath);
            }
            catch (Exception e)
            {
                //Logger.LogMessage(LogInfo.Error, "could not delete attach file\n" + e);
                throw;
            }
            return Json(new { result = "OK" });
        }
        [Authorize]
        public ActionResult SaveAttachment(AttachFile attachFile)
        {
            string fileName = string.Empty;
            try
            {
                string fileDir = Path.Combine(m_AttachBaseDir, attachFile.SurveyId.ToString());
                Directory.CreateDirectory(fileDir);
                //attachFile.FileName.Replace("")
                fileName = string.Format("{0}-{1:yy-MM-dd-mm-ss}-{2}", attachFile.SurveyId, DateTime.Now, attachFile.FileName);
                string filePath = Path.Combine(fileDir,
                    fileName);

                System.IO.File.WriteAllBytes(filePath, Convert.FromBase64String(attachFile.Document));
            }
            catch (Exception e)
            {
                //Logger.LogMessage(LogInfo.Error, "could not save attach file\n" + e);
                throw;

            }
            return Json(new { result = "OK", fileName = Path.Combine(attachFile.SurveyId.ToString(), fileName) });
        }

    }
}
