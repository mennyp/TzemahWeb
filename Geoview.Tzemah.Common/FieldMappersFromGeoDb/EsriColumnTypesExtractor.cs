using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;
using System.Xml.Linq;
//using DDK.Inf.Log;


namespace Geoview.Tzemah.Common
{
   //[Log]
    public class EsriColumnTypesExtractor
    {
        public Dictionary<string, TzemahFieldType> Parse(string innerXml)
        {
            XElement xmlDoc = XElement.Parse(innerXml);
            Dictionary<string, TzemahFieldType> result = new Dictionary<string, TzemahFieldType>();
            foreach (XElement fieldDefinition in xmlDoc.Descendants("GPFieldInfoEx"))
            {

                TzemahFieldType fieldType;
                if(!TzemahFieldType.TryParse(fieldDefinition.Element("FieldType").Value, out fieldType))
                {
                    //Logger.LogMessage(LogInfo.Error, string.Format(@"could not get the type of the field {0}", fieldDefinition.Element("FieldType").Value));
                }
                result.Add(fieldDefinition.Element("Name").Value, fieldType);
            }
            return result;
        }
    }
}
