using System;
using System.Collections.Generic;
using System.Linq;
//using DDK.Inf.Log;
using Geoview.Tzemah.Common.Fields;

namespace Geoview.Tzemah.Common
{
    //[Log]
    public class SoilSurveyRow
    {
        private static readonly Dictionary<string, Field<string>> HebrewEnglishFieldsDictionary = new Dictionary<string, Field<string>>();
        private readonly Dictionary<string, object> m_Values = new Dictionary<string, object>();
        private readonly MagikDataLine m_Line;
        private readonly MagikHeader m_Header;
        private readonly SurveyPits m_Pits;
        public object this[string fieldName]
        {
            get
            {
                return m_Values[fieldName];
            }
        }


        public List<string> Fields
        {
            get
            {
                return m_Values.Keys.ToList();
            }
        }
        static SoilSurveyRow()
        {
            HebrewEnglishFieldsDictionary["עבודה"] =  new IntField<string>("JobId");
            HebrewEnglishFieldsDictionary["מדגם"] = new IntField<string>("SampleId");
            HebrewEnglishFieldsDictionary["עומק מ-"] = new IntField<string>("DepthFrom");
            HebrewEnglishFieldsDictionary["עומק עד"] = new IntField<string>("DepthTo");
            HebrewEnglishFieldsDictionary["תאריך קבלה"] = new DateField<string>("RecievalDate");
            HebrewEnglishFieldsDictionary["מגדל"] = new StringField<string>("Megadel");
            HebrewEnglishFieldsDictionary["גידול"] = new StringField<string>("Gidul");
            HebrewEnglishFieldsDictionary["זן"] = new StringField<string>("Variety");
            HebrewEnglishFieldsDictionary["הערת מדגם"] = new StringField<string>("SampleRemark");
            
        }


        public SoilSurveyRow(int surveyId, SurveyPits pits, MagikDataLine line, MagikHeader header)
        {
            m_Values["SurveyId"] = surveyId;
            m_Pits = pits;
            m_Line = line;
            m_Header = header;

            try
            {
                ParseLine();
            }
            catch (Exception e)
            {
                //Logger.LogMessage(LogInfo.Error, string.Format("pit {0} not exists in survey {1}",e,surveyId));
                throw;
            }

        }


        private void ParseLine()
        {
            string[] cells = m_Line.Cells;
            for (int i = 0; i < m_Header.ColumnNames.Length; i++)
            {
                string columnName = m_Header.ColumnNames[i];
                string cellValue = cells[i];

                // pits:
                if (columnName == "בור")
                {
                    m_Pits.SetValue(m_Values, cellValue);
                    continue;
                }

                //2test: if unrecognized field name should throw exception?
                if (HebrewEnglishFieldsDictionary.ContainsKey(columnName))
                {
                    Field<string> dbField = HebrewEnglishFieldsDictionary[columnName];
                    m_Values[dbField.Key] = dbField.Parse(cellValue);
                }


            }
        }


        
    }
}
