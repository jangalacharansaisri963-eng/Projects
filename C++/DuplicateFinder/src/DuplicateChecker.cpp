#include "DuplicateChecker.h"

#include <QFileInfo>


QMap<QString, QStringList> DuplicateChecker::findByName(
    const QStringList &files
)
{

    QMap<QString, QStringList> duplicates;


    for(const QString &file : files)
    {

        QFileInfo info(file);


        QString name = info.fileName();


        duplicates[name].append(file);

    }



    QMap<QString, QStringList> result;



    for(auto it = duplicates.begin(); it != duplicates.end(); ++it)
    {

        if(it.value().size() > 1)
        {
            result[it.key()] = it.value();
        }

    }



    return result;
}
