using System;
using System.Collections.Generic;
//using DDK.Inf.Log;
using Geoview.Tzemah.Common.LabData;

namespace Geoview.Tzemah.Common
{
    //[Log]
    public class Importer
    {
        private readonly MagikToRowsDictionary m_MagikToRowsDictionary;


        //private int SurveyId { get; set; }

        //public int ImportedFileId { get; set; }

        #region Public

        public Importer(MagikToRowsDictionary magikToRowsDictionary)
        {
            m_MagikToRowsDictionary = magikToRowsDictionary;
        }

        public List<LabDataModel> Import(string labDataContent, Dictionary<string, int> surveyPits,int surveyId)
        {

            //MagikToRowsDictionary magikToRowsDictionary = m_Dal.LoadMaterialsFromDb();
            SurveyPits pits = ConvertPitsIdsToSurveyPits(surveyPits);

            MagikFile file = new MagikFile(labDataContent);
            MagikHeader header = new MagikHeader(file.HeaderPart);

            //ImportedFileId=m_Dal.FlushFileInDb(file);
            List<LabDataModel> result = new List<LabDataModel>();
            foreach (string bodyLine in file.BodyPart)
            {
                try
                {
                    MagikDataLine line = new MagikDataLine(bodyLine);

                    SoilSurveyRow soilSurveyRow = new SoilSurveyRow(surveyId, pits, line, header);

                    SoilSurveyMaterialsTable soilSurveyMaterials = new SoilSurveyMaterialsTable(header, line,
                        m_MagikToRowsDictionary);
                    LabDataModel labRow = new LabDataModel(soilSurveyRow, soilSurveyMaterials);
                    result.Add(labRow);
                }
                catch (Exception e)
                {
                    //Logger.LogMessage(LogInfo.Error, "could not parse line \n" + bodyLine);
                }
            }
            return result;


        }



        #endregion


        #region Private

        private SurveyPits ConvertPitsIdsToSurveyPits(Dictionary<string, int> pitIds)
        {
            SurveyPits pits = new SurveyPits();
            foreach (KeyValuePair<string,int> pitId in pitIds)
            {
                pits.Add(pitId.Value, pitId.Key);
            }

            return pits;
        }



        #endregion
    }
}
