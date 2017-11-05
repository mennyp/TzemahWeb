using System.Diagnostics;
using System.IO;
//using DDK.Inf.Log;
using Novacode;

namespace Geoview.Tzemah.Common
{
    //[Log]
    public class WordReportCreator
    {

        #region DataMembers

        #endregion


        #region Publics
        public void Create(string fileName)
        {
            string fullFileName = CreateFullFileName(fileName);

            DocX doc = DocX.Create(fullFileName);

            doc.InsertParagraph("Test paragraph");

            doc.Save();

            Process.Start("winword.exe", fullFileName);
        }

        

        #endregion

        #region Privates

        private string CreateFullFileName(string fileName)
        {
            return  Path.Combine(Path.GetTempPath(),fileName+".docx");
        }

        #endregion

    }
}
