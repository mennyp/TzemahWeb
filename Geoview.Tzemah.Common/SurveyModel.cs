using System;
using System.Collections.Specialized;
using System.Data.SqlTypes;
using System.Globalization;
using System.Runtime.Serialization;
//using DDK.Inf.Log;
using Microsoft.SqlServer.Types;

namespace Geoview.Tzemah.Common
{
    //[Log]
    [Serializable]
    public class SurveyModel
    {
        public SurveyModel(int id, string name, DateTime date)
        {
            SurveyId = id;
            SurveyName = name;
            SurveyDate = date;
        }

        public SurveyModel(NameValueCollection valuesCollection)
        {
            int surveyId;
            Int32.TryParse(valuesCollection["SurveyId"], out surveyId);
            SurveyId = surveyId;
            SurveyName = valuesCollection["SurveyName"];
            SurveyDate = DateTime.ParseExact(valuesCollection["SurveyDate"],"dd/M/yyyy",CultureInfo.InvariantCulture);
        }

        [DataMember]
        public int SurveyId { get; set; }
        [DataMember]
        public string SurveyName { get; set; }
        [DataMember]
        public DateTime SurveyDate { get; set; }
    }
}
