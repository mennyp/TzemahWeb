using System;
using System.Collections.Specialized;
using System.Data;
using System.Data.SqlTypes;
using System.Runtime.Serialization;
//using DDK.Inf.Log;
using Microsoft.SqlServer.Types;

namespace Geoview.Tzemah.Common
{
    //[Log]
    [Serializable]
    public class Pit
    {
        public Pit(DataRow row)
        {
            PitId = row.Field<int>("PitId");
            PitName = row.Field<string>("PitName");
            SurveyId = row.Field<int>("SurveyId");
            PitNumberInSurvey = row.Field<int>("PitNumberInSurvey");
            m_Geom = (SqlGeometry)row["Geom"];
            Conclusions = row.Field<string>("Conclusions");
        }

        public Pit(NameValueCollection valuesCollection)
        {
            int pitId ;
            Int32.TryParse(valuesCollection["PitId"], out pitId);
            PitId = pitId;
            PitName = valuesCollection["PitName"];
            SurveyId = Convert.ToInt32(valuesCollection["SurveyId"]);
            int x= Convert.ToInt32(valuesCollection["X"]);
            int y= Convert.ToInt32(valuesCollection["Y"]);
            PitNumberInSurvey = Convert.ToInt32(valuesCollection["PitNumberInSurvey"]);
            m_Geom = SqlGeometry.STPointFromText(new SqlChars(string.Format(@"POINT({0} {1})",x,y)),2039) ;
            
            Conclusions = valuesCollection["Conclusions"];
        }

        #region privateFields
        
        private readonly SqlGeometry m_Geom;

        #endregion

        #region public Properties
        [DataMember]
        public int PitId {get;private set; }
        [DataMember]
        public string PitName { get; private  set; }
        [DataMember]
        public string Conclusions { get; private set; }
        [DataMember]
        public int SurveyId { get; private set; }
        [DataMember]
        public int PitNumberInSurvey { get; private set; }
        [DataMember]
        public double X
        {
            get { return m_Geom.STX.Value; }
        }
        [DataMember]
        public double Y
        {
            get { return m_Geom.STY.Value; }
        }

        #endregion

    }
}
