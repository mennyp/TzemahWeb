using System;
using System.Runtime.Serialization;
//using DDK.Inf.Log;

namespace Geoview.Tzemah.Common
{
    //[Log]
    [Serializable]
    public class AttachmentModel
    {
        [DataMember]
        public int DocumentId { get; private set; }
        [DataMember]
        public int SurveyId { get; private set; }
        [DataMember]
        public string Link { get; private set; }
        [DataMember]
        public string Comment { get; private set; }
        [DataMember]
        public Int16 Type { get; private set; }

        public AttachmentModel(int surveyId, string link, string comment, short type, int documentId)
        {
            DocumentId = documentId;
            SurveyId = surveyId;
            Link = link;
            Type = type;
            Comment = comment;
        }
    }
}
