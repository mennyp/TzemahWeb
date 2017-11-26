using System.Collections.Generic;
//using DDK.Inf.Log;

namespace Geoview.Tzemah.Common
{
    //[Log]
    public class MagikFile
    {
        private string m_HeaderPart;
        private string[] m_BodyPart;
        public string HeaderPart {
            get { return m_HeaderPart; }
        }

        public string[] BodyPart { get { return m_BodyPart; }
        }
    


        public MagikFile(string reportContent)
        {
            //m_FilePath = filePath;
            ParseFile(reportContent);
        }

        private void ParseFile(string reportContent)
        {
            string[] lines = reportContent.Split('\n');

            //// find first line after dashes = header:
            //int firstLineAfterDashes = -1; 
            //for (int i = 0; i < lines.Length; i++)
            //{
            //    if (lines[i].StartsWith("-----"))
            //    {
            //        // found first line with dashes!
            //        firstLineAfterDashes = i + 1;
            //        break;
            //    }
            //}
            ////2test: what if there are no dashes? no first line after dashes?

            //string header1 = lines[firstLineAfterDashes];
            //string header2 = lines[firstLineAfterDashes+1];
            //string header12 = header1 + "\r\n" + header2;

            //m_HeaderPart = header12;

            //int FIRST_LINE_OF_DATA = firstLineAfterDashes + 3;
            //List<string> body = new List<string>();
            //for (int i = FIRST_LINE_OF_DATA; i < lines.Length; i++)
            //{
            //    if (lines[i].StartsWith("-----")) break;
            //    body.Add(lines[i]);
            //}
            //m_BodyPart = body.ToArray();

            m_HeaderPart = lines[0];
            List<string> body = new List<string>();
            for (int i = 1; i < lines.Length; i++)
            {
                body.Add(lines[i]);
            }
            m_BodyPart = body.ToArray();

        }

       
    }
}
