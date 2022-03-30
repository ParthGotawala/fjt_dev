using System;
using System.Data.Common;
using System.Linq;
using System.Linq.Expressions;

namespace FJT.Reporting.Repository.Interface
{
    public interface IRepository<T> : IDisposable where T : class
    {
        void Commit();
        IQueryable<T> All();
        IQueryable<T> Filter(Expression<Func<T, bool>> predicate);
        bool Contains(Expression<Func<T, bool>> predicate);
        T FindOne(params object[] keys);
        T FindOne(Expression<Func<T, bool>> predicate);
        IQueryable<T> Find(Expression<Func<T, bool>> predicate);
        T Create(T T);
        int Delete(T T);
        int Delete(Expression<Func<T, bool>> predicate);
        int Update(T t);
        int Count { get; }
        void SetValues(object DestinationValue, object SourceValue);
        DbCommand GetCommand();
        void Reload(T t);
        bool Any(Expression<Func<T, bool>> predicate);
    }
}
