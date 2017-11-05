//using DDK.Inf.Log;

namespace Geoview.Tzemah.Common
{
    //[Log]
    public class MagikDataLine
    {
        public MagikDataLine(string line)
        {
            this.Cells = line.Split('\t');
        }

        public readonly string[] Cells;
    }
}
