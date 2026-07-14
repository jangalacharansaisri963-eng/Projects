#ifndef DUPLICATECHECKER_H
#define DUPLICATECHECKER_H

#include <QStringList>
#include <QMap>


class DuplicateChecker
{

public:

    static QMap<QString, QStringList> findByName(
        const QStringList &files
    );


};


#endif
