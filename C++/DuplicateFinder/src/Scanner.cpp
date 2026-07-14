#include "Scanner.h"

#include <QDirIterator>


QStringList Scanner::scan(
    const QString &folder
)
{

    QStringList files;


    QDirIterator iterator(
        folder,
        QDirIterator::Subdirectories
    );


    while(iterator.hasNext())
    {
        QString file = iterator.next();


        if(!file.endsWith("."))
        {
            files.append(file);
        }
    }


    return files;
}
