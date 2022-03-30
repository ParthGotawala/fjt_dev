
using System;
using System.Linq;
using System.Data.Entity;
using System.Linq.Expressions;
using System.Data.Common;
using System.Data.Entity.Infrastructure;
using fjt.pricingservice.Repository.Interface;
using fjt.pricingservice.MySqlDBModel;

namespace fjt.pricingservice.Repository
{
    public class Repository<T> : IRepository<T> where T : class
    {
        protected FJTSqlDBContext Context = null;
        public Repository(FJTSqlDBContext context)
        {
            Context = context;
        }
        public void Dispose()
        {
            Context.Dispose();
        }
        protected DbSet<T> DbSet
        {
            get
            {
                return Context.Set<T>();
            }
        }
        public void Commit()
        {
            Context.SaveChanges();
        }
        public virtual IQueryable<T> All()
        {
            return DbSet.AsQueryable();
        }
        public virtual IQueryable<T> Filter(Expression<Func<T, bool>> predicate)
        {
            return DbSet.Where(predicate).AsQueryable<T>();
        }
        public bool Contains(Expression<Func<T, bool>> predicate)
        {
            return DbSet.Count(predicate) > 0;
        }
        public virtual T FindOne(params object[] keys)
        {
            return DbSet.Find(keys);
        }
        public virtual T FindOne(Expression<Func<T, bool>> predicate)
        {
            return DbSet.FirstOrDefault(predicate);
        }
        public virtual IQueryable<T> Find(Expression<Func<T, bool>> predicate)
        {
            return DbSet.Where(predicate);
        }
        public virtual T Create(T T)
        {
            var newEntry = DbSet.Add(T);
            //Commit();
            return newEntry;
        }
        public virtual int Count
        {
            get
            {
                return DbSet.Count();
            }
        }
       
        public virtual int Delete(T T)
        {
            DbSet.Remove(T);
            //Commit();
            return 0;
        }

        public virtual int Update(T T)
        {
            var entry = Context.Entry(T);
            DbSet.Attach(T);
            entry.State = EntityState.Modified;
            //Commit();
            return 0;
        }
        public virtual int Delete(Expression<Func<T, bool>> predicate)
        {
            var objects = Filter(predicate);
            foreach (var obj in objects)
                DbSet.Remove(obj);
            return 0;
        }

        public virtual void SetValues(object DestinationValue, object SourceValue)
        {
            Context.Entry(DestinationValue).CurrentValues.SetValues(SourceValue);
        }


        public virtual DbCommand GetCommand()
        {
            DbCommand dbCmd = Context.Database.Connection.CreateCommand();
            return dbCmd;
        }
        public virtual void Reload(T T)
        {
            Context.Entry(T).Reload();
        }
        public virtual void ReloadReference(T T, string refProperty)
        {
            Context.Entry(T).Reference(refProperty).Load();
        }
        public void UpdateModifiedProperty(T T, string PropertyName)
        {
            ((IObjectContextAdapter)Context).ObjectContext.ObjectStateManager.GetObjectStateEntry(T).SetModifiedProperty(PropertyName);
        }
        public virtual bool Any(Expression<Func<T, bool>> predicate)
        {
            return DbSet.Any(predicate);
        }
    }
}
