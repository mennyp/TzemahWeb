using System;
using System.Collections.Generic;
//using DDK.Inf.Log;

namespace Geoview.Tzemah.Common
{
    //[Log]
    public class SurveyPits
    {

        private readonly Dictionary<string, int> m_PitIds = new Dictionary<string, int>();

        
        public void Add(int pitId, string pitNumberInSurvey)
        {
            m_PitIds[pitNumberInSurvey.Trim()] = pitId;
        }

        public void SetValue(Dictionary<string, object> values, string pitNumberInSurvey)
        {
            string trimmedPitNumberInSurvey = pitNumberInSurvey.Trim();
            if (m_PitIds.ContainsKey(trimmedPitNumberInSurvey))
            {
                values["PitId"] = m_PitIds[trimmedPitNumberInSurvey];
                return;
            }

            throw new ApplicationException("Unrecognized pitNumberInSurvey: '" + pitNumberInSurvey + "'");
        }

        public int getPitIdVal(string pitNumberInSurvey)
        {
            string trimmedPitNumberInSurvey = pitNumberInSurvey.Trim();
            if (m_PitIds.ContainsKey(trimmedPitNumberInSurvey))
            {
                return m_PitIds[trimmedPitNumberInSurvey];
            }

            throw new ApplicationException("Unrecognized pitNumberInSurvey: '" + pitNumberInSurvey + "'");
        }
    }
}
