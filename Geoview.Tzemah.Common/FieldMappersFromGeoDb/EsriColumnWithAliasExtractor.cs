using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Linq;
//using DDK.Inf.Log;

namespace Geoview.Tzemah.Common.FieldMappersFromGeoDb
{
    //[Log]
    public class EsriColumnWithAliasExtractor
    {
        public Dictionary<string, string> Parse(string innerXml)
        {
            XElement xmlDoc = XElement.Parse(innerXml);
            return xmlDoc.Descendants("GPFieldInfoEx").ToDictionary(fieldDefinition => fieldDefinition.Element("Name").Value, fieldDefinition => fieldDefinition.Element("AliasName").Value);
        }
    }
}
