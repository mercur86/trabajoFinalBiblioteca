package com.biblioteca.service.impl;

import com.biblioteca.exception.ModelNotFoundException;
import com.biblioteca.repository.IGenericRepo;
import com.biblioteca.service.ICRUD;

import java.lang.reflect.Method;
import java.util.List;

public abstract class CRUDImpl<T, ID> implements ICRUD<T, ID> {

    protected abstract IGenericRepo<T, ID> getRepo();

    @Override
    public T save(T t) {
        return getRepo().save(t);
    }

    @Override
    public T update(ID id, T t) throws Exception {
        //unnamed variables desde Java 25
        var _ = this.findById(id);

        //Java API Reflection: setId + nombre de la entidad (setIdLibro, setIdCategoria, ...)
        String className = t.getClass().getSimpleName();
        String methodName = "setId" + className;
        Method setIdMethod = t.getClass().getMethod(methodName, id.getClass());
        setIdMethod.invoke(t, id);

        return getRepo().save(t);
    }

    @Override
    public List<T> findAll() {
        return getRepo().findAll();
    }

    @Override
    public T findById(ID id) {
        return getRepo().findById(id).orElseThrow(() -> new ModelNotFoundException("ID NOT FOUND: " + id));
    }

    @Override
    public void delete(ID id) {
        var _ = this.findById(id);
        getRepo().deleteById(id);
    }
}
