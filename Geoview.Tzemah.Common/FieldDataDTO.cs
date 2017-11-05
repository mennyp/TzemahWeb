//using System.Data;

//namespace Geoview.Tzemah.Common
//{
//    public class FieldDataDTO
//    {
//        #region privateFields

//        private int _id;
//        private int _pitId;
//        private int _depthId;
//        private int _depthValue;
//        private int _colorLevel;
//        private int _structure;
//        private int _porosity;
//        private int _porosityVis;
//        private int _roots;
//        private int _stone;
//        private int _percolation;
//        private int _aggregate;
//        private int _brittle;
//        private int _consolidation;
//        private int _frictionSurf;
//        private int _marl;
//        private int _lime;
//        private int _groundwater;
//        private string _comment;

//        #endregion

//        public FieldDataDTO(DataRow row)
//        {
//            _id = row.Field<int>("Id");
//            _pitId = row.Field<int>("PitId");
//            _depthId = row.Field<int>("DepthId");
//            _depthValue = row.Field<int>("DepthValue");
//            _colorLevel = row.Field<int>("ColorLevel");
//            _structure = row.Field<int>("Structure");
//            _porosity = row.Field<int>("Porosity");
//            _porosityVis = row.Field<int>("PorosityVis");
//            _roots = row.Field<int>("Roots");
//            _stone = row.Field<int>("Stone");
//            _percolation = row.Field<int>("Percolaton");
//            _aggregate = row.Field<int>("Aggregate");
//            _brittle = row.Field<int>("Brittle");
//            _consolidation = row.Field<int>("Consolidation");
//            _frictionSurf = row.Field<int>("FrictionSurf");
//            _marl = row.Field<int>("Marl");
//            _lime = row.Field<int>("Lime");
//            _groundwater = row.Field<int>("Groundwater");
//            _comment = row.Field<string>("Comment");
//        }

//        #region publicProperties

//        public int Id
//        {
//            get { return _id; }
//        }
//        public int PitId
//        {
//            get { return _pitId; }
//            set { _pitId = value; }
//        }
//        public int DepthId
//        {
//            get { return _depthId; }
//            set { _depthId = value; }
//        }
//        public int DepthValue
//        {
//            get { return _depthValue; }
//            set { _depthValue = value; }
//        }

//        public int ColorLevel
//        {
//            get { return _colorLevel; }
//            set { _colorLevel = value; }
//        }

//        public int Structure
//        {
//            get { return _structure; }
//            set { _structure = value; }
//        }

//        public int Porosity
//        {
//            get { return _porosity; }
//            set { _porosity = value; }
//        }

//        public int PorosityVis
//        {
//            get { return _porosityVis; }
//            set { _porosityVis = value; }
//        }

//        public int Roots
//        {
//            get { return _roots; }
//            set { _roots = value; }
//        }

//        public int Stone
//        {
//            get { return _stone; }
//            set { _stone = value; }
//        }

//        public int Percolation
//        {
//            get { return _percolation; }
//            set { _percolation = value; }
//        }

//        public int Aggregate
//        {
//            get { return _aggregate; }
//            set { _aggregate = value; }
//        }

//        public int Brittle
//        {
//            get { return _brittle; }
//            set { _brittle = value; }
//        }

//        public int Consolidation
//        {
//            get { return _consolidation; }
//            set { _consolidation = value; }
//        }

//        public int FrictionSurf
//        {
//            get { return _frictionSurf; }
//            set { _frictionSurf = value; }
//        }

//        public int Marl
//        {
//            get { return _marl; }
//            set { _marl = value; }
//        }

//        public int Lime
//        {
//            get { return _lime; }
//            set { _lime = value; }
//        }

//        public int Groundwater
//        {
//            get { return _groundwater; }
//            set { _groundwater = value; }
//        }

//        public string Comment
//        {
//            get { return _comment; }
//            set { _comment = value; }
//        }

//        #endregion

//        #region publicMethods

//        public bool AddEdit()
//        {
//            return false;
//        }

//        public bool Delete()
//        {
//            return false;
//        }

//        #endregion
//    }
//}
