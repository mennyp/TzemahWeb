using System;
using System.Collections.Generic;
//using DDK.Inf.Log;
using Newtonsoft.Json;

namespace Geoview.Tzemah.Common.LabData
{
    //[Log]
    public class LabDataSerializer : JsonConverter
    {
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var labData = value as LabDataModel;
            IEnumerable<KeyValuePair<string, object>> properties = labData.GetProperties(true);
         
           
            writer.WriteStartObject();
            foreach (KeyValuePair<string, object> property in properties)
            {
                writer.WritePropertyName(property.Key);
                serializer.Serialize(writer, property.Value);
            }
            
            writer.WriteEndObject();


            
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override bool CanConvert(Type objectType)
        {
            throw new NotImplementedException();
        }
    }
}
