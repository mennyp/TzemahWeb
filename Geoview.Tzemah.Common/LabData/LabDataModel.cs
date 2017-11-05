using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Runtime.Serialization;
//using DDK.Inf.Log;
using Microsoft.SqlServer.Types;
using Newtonsoft.Json;
using Westwind.Utilities;

namespace Geoview.Tzemah.Common.LabData
{
    //[Log]
    [Serializable]
    [JsonConverter(typeof(LabDataSerializer))]
    public class LabDataModel : Expando
    {
        public LabDataModel(int pitId, int depthFrom, int soilSmapleId)
        {
            PitId = pitId;
            DepthFrom = depthFrom;
            SoilSampleId = soilSmapleId;
        }

        public LabDataModel(DataRow row, Dictionary<string,TzemahFieldType> fieldNames)
        {
            PitId = row.Field<int>("PitId");
            DepthFrom = row.Field<Int16>("DepthFrom");
            SoilSampleId = row.Field<int>("OBJECTID");
            DepthId = row.Field<Int16>("DepthId");
            SurveyId = row.Field<int>("SurveyId");
            RecievalDate = row.Field<DateTime>("RecievalDate");
            SAMPLEID = row.Field<int>("SAMPLEID");
            DepthTo = row.Field<Int16>("DepthTo");
            Megadel = row.Field<string>("Megadel");
            Gidul = row.Field<string>("Gidul");
            Variety = row.Field<string>("Variety");
            SampleRemark = row.Field<string>("SampleRemark");
            SqlGeometry location = row.Field<SqlGeometry>("SHAPE");
            X = (int)location.STX;
            Y = (int)location.STY;
            ColumnMapper.MapColumnValues(this, row, fieldNames);
        }

       


        public LabDataModel(NameValueCollection paramsCollection, List<string> materialFieldNames)
        {
            //PitId = paramsCollection("PitId");
            try
            {
                DepthFrom = Convert.ToInt32(paramsCollection["DepthFrom"]);
                SoilSampleId = Convert.ToInt32(paramsCollection["SoilSampleId"]);
                DepthId = Convert.ToInt32(paramsCollection["DepthId"]);
                RecievalDate = DateTime.ParseExact(paramsCollection["RecievalDate"], "dd/M/yyyy", CultureInfo.InvariantCulture);
                DepthTo = Convert.ToInt32(paramsCollection["DepthTo"]);
                Megadel= paramsCollection["Megadel"];
                Gidul = paramsCollection["Gidul"];
                Variety = paramsCollection["Variety"];
                SampleRemark = paramsCollection["SampleRemark"];
            }
            catch (Exception e)
            {
                //Logger.LogMessage(LogInfo.Error, e.ToString());
            }

            foreach (string fieldName in materialFieldNames)
            {
                try
                {
                    this[fieldName] = paramsCollection[fieldName];
                }
                catch (Exception e)
                {
                    //Logger.LogMessage(LogInfo.Error, string.Format("Problem getting field {0} from pitId {1} depthFrom {2} Soil sampleId {3} \r\n Exception:\r\n{4}", fieldName, PitId, DepthFrom, SoilSampleId, e));
                }
            }
            
        }

        public LabDataModel(SoilSurveyRow soilSurveyRow, SoilSurveyMaterialsTable soilSurveyMaterials)
        {
            PitId = (int) soilSurveyRow["PitId"];
            //MagikFileId = (int)soilSurveyRow["MagikFileId"];
            JOBID = (int)soilSurveyRow["JobId"];
            
            RecievalDate = (DateTime) soilSurveyRow["RecievalDate"];
            Megadel = (string) soilSurveyRow["Megadel"];
            DepthFrom = (int) soilSurveyRow["DepthFrom"];
            DepthTo = (int) soilSurveyRow["DepthTo"];
            Gidul = (string) soilSurveyRow["Gidul"];
            Variety = (string) soilSurveyRow["Variety"];
            SampleRemark = (string) soilSurveyRow["SampleRemark"];
            SurveyId = (int) soilSurveyRow["SurveyId"];
            SAMPLEID = (int) soilSurveyRow["SampleId"];
            foreach (KeyValuePair<string, object> material in soilSurveyMaterials)
            {
                try
                {
                    this[material.Key] = material.Value;
                }
                catch (Exception e)
                {
                    //Logger.LogMessage(LogInfo.Error, string.Format("Problem getting field {0} from pitId {1} depthFrom {2} Soil sampleId {3} \r\n Exception:\r\n{4}", material.Key, PitId, DepthFrom, SoilSampleId, e));
                }
            }
        
        }

        
        public override string ToString()
        {
            string result = string.Empty;
            IEnumerable<KeyValuePair<string, object>> properties = GetProperties(true);
            result = properties.Aggregate(result, (current, property) => current + string.Format(@"{0}:{1},", property.Key, property.Value));
            result += "\r\n";
            return result;
        }
        public int JOBID { get; set; }

        public int MagikFileId { get; set; }

        [DataMember]
        public int PitId { get; set; }
        [DataMember]
        public int DepthId { get; set; }
        [DataMember]
        public int SurveyId { get; set; }
        [DataMember]
        public DateTime RecievalDate { get; set; }
        [DataMember]
        public int SAMPLEID { get; set; }
        //public int? LabSystemId { get; set; }
        [DataMember]
        public int DepthTo { get; set; }
        [DataMember]
        public string Megadel { get; set; }
        [DataMember]
        public string Gidul { get; set; }
        [DataMember]
        public string Variety { get; set; }
        [DataMember]
        public string SampleRemark { get; set; }

        [DataMember]
        public int DepthFrom { get; set; }
        [DataMember]
        public int SoilSampleId { get; set; }
        [DataMember]
        public int X { get; set; }
        [DataMember]
        public int Y { get; set; }

    }
}
