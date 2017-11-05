﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
//using DDK.Inf.Log;
using Geoview.Tzemah.Common.Interfaces;

namespace Geoview.Tzemah.Common.FieldMappersFromGeoDb
{
    //[Log]
    public class EsriColumnAliasExtractor
    {
               private readonly ICommandExecutor m_CommandExecutor;
        private readonly List<string> m_ObligatoryFields;

        public EsriColumnAliasExtractor(ICommandExecutor commandExecutor, List<string> obligatoryFields)
        {
            m_CommandExecutor = commandExecutor;
            m_ObligatoryFields = obligatoryFields;
        }

        public Dictionary<string, string> GetFieldNames(string tableName)
        {
             string sql = string.Format(@"SELECT  definition  FROM GDB_ITEMS where name like '%DBO.{0}'",tableName);
             Dictionary<string, string> result = new Dictionary<string, string>();
            using (SqlCommand cm = new SqlCommand(sql))
            {

                DataTable dt = m_CommandExecutor.Execute(cm);
                if (dt.Rows.Count != 1)
                {
                    //Logger.LogMessage(LogInfo.Warning,string.Format(@"The number of layers in GDB_ITEMS with the name '%DBO.{0}' is not 1 , but  " + dt.Rows.Count,tableName));
                }
                if (dt.Rows.Count == 0)
                {
                    return result;
                }
                string fieldDataColumnsXml = dt.Rows[0].Field<string>("definition");
                ExtractFieldDataColumns(result, fieldDataColumnsXml);
            }

            return result;
        }

        private void ExtractFieldDataColumns(Dictionary<string, string> result, string xmlDefinition)
        {
            EsriColumnWithAliasExtractor esriColumnTypesExtractor = new EsriColumnWithAliasExtractor();
            Dictionary<string, string> allTheColumns = esriColumnTypesExtractor.Parse(xmlDefinition);
            foreach (KeyValuePair<string, string> column in allTheColumns)
            {
                if (!m_ObligatoryFields.Contains(column.Key, StringComparer.InvariantCultureIgnoreCase))
                {
                    result.Add(column.Key, column.Value);
                }
            }
        }
    }
}
