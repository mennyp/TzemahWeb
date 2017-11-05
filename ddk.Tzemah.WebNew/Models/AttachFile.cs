using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ddk.Tzemah.WebNew.Models
{
    public class AttachFile
    {
        public string Document { get; set; }
        public int SurveyId { get; set; }
        public string FileName { get; set; }
        public string FileType { get; set; }
    }
}