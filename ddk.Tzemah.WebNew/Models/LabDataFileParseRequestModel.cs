using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Geoview.Tzemah.Common;

namespace ddk.Tzemah.WebNew.Models
{
    [Serializable]
    public class LabDataFileParseRequestModel
    {
        public Dictionary<string,int> PitIds { get; set; }
        public MagikToRowsDictionary ColumnsToLabelsTranslation { get; set; }
        public string MagikFileData { get; set; }
        public int SurveyId { get; set; }

    }
}