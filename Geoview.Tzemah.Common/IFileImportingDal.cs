namespace Geoview.Tzemah.Common
{
    public interface IFileImportingDal
    {
        SurveyPits LoadSurveyPits(int surveyId);

        MagikToRowsDictionary LoadMaterialsFromDb();
    }
}
